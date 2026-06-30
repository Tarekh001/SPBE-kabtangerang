import { secureFetch } from '@/lib/api';
import logger from '@/lib/logger';

// ─────────────────────────────────────────────
// URL Utilities
// ─────────────────────────────────────────────

/**
 * Origin server backend untuk gambar/file statis.
 * Dibaca dari environment variable VITE_MEDIA_ORIGIN.
 * Digunakan untuk mengkonversi path relatif dari API menjadi URL absolut.
 */
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN || '').replace(/\/+$/, '');

/**
 * Mengkonversi path relatif dari API menjadi URL lengkap.
 * @param {string} path - Path relatif (misal `/images/foto.jpg`)
 * @returns {string} URL lengkap
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Path relatif (misal /images/foto.jpg) — di dev lewat Vite proxy, di prod lewat nginx proxy
  return path.startsWith('/') ? path : '/' + path;
};

/**
 * Alias untuk getFileUrl — sama dengan getImageUrl (path juga di-encode)
 */
export const getFileUrl = getImageUrl;

// ─────────────────────────────────────────────
// Generic Fetch Helper
// ─────────────────────────────────────────────

/**
 * Generic fetcher yang mengekstrak array data dari response API.
 * Response API selalu berformat: { data: { data: [...], meta: {...} } }
 *
 * @param {string} endpoint - Path endpoint (misal '/indeks')
 * @param {Object} [options] - Opsi tambahan untuk secureFetch
 * @returns {Promise<Array>} Array data dari response
 */
const fetchApiData = async (endpoint, options = {}) => {
  try {
    const response = await secureFetch(endpoint, {
      method: 'GET',
      timeout: 10000,
      retries: 1,
      ...options,
    });

    // Response format: { data: { data: [...], meta: {...} } }
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Fallback jika format berbeda
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;

    logger.warn(`Format response tidak dikenali untuk ${endpoint}`, response);
    return [];
  } catch (error) {
    logger.error(`fetchApiData(${endpoint})`, error);
    throw error;
  }
};

// ─────────────────────────────────────────────
// Endpoint-specific Fetch Functions
// ─────────────────────────────────────────────

/**
 * Mengambil data implementasi dari endpoint /indeks
 * @returns {Promise<Array>} Data indeks implementasi
 */
export const fetchIndeks = () => fetchApiData('/indeks');

/**
 * Mengambil daftar domain dari endpoint /domain
 * @returns {Promise<Array>} Daftar domain
 */
export const fetchDomains = () => fetchApiData('/domain');

/**
 * Mengambil daftar aspek dari endpoint /aspek
 * @returns {Promise<Array>} Daftar aspek (memiliki field domainId)
 */
export const fetchAspek = () => fetchApiData('/aspek');

/**
 * Mengambil daftar indikator dari endpoint /indikator
 * @returns {Promise<Array>} Daftar indikator (memiliki field aspekId)
 */
export const fetchIndikator = () => fetchApiData('/indikator');

/**
 * Mengambil daftar regulasi dari endpoint /regulasi
 * @returns {Promise<Array>} Daftar regulasi (memiliki field categoryRegulasiId)
 */
export const fetchRegulasiList = () => fetchApiData('/regulasi');

/**
 * Mengambil daftar kategori regulasi dari endpoint /categoryregulasi
 * @returns {Promise<Array>} Daftar kategori regulasi
 */
export const fetchCategoryRegulasi = () => fetchApiData('/categoryregulasi');

/**
 * Mengambil daftar menu dinamis dari endpoint /menu
 * @returns {Promise<Array>} Daftar menu (fields: id, name, type, parentId, hasContent, externalLink, isVisible)
 */
export const fetchMenuList = () => fetchApiData('/menu');

/**
 * Mengambil daftar konten dari endpoint /content
 * @returns {Promise<Array>} Daftar konten (fields: id, menuId, title, body, imageUrl, isVisible)
 */
export const fetchContentList = () => fetchApiData('/content');

/**
 * Convenience object grouping CMS API endpoints (Smart City pattern).
 * Used by menuConfig.js to fetch menu + content.
 */
export const apiEndpoints = {
  menu: {
    getAll: () => fetchApiData('/menu'),
  },
  content: {
    getAll: () => fetchApiData('/content'),
  },
};

// ─────────────────────────────────────────────
// DEPRECATED — Legacy functions (backward compat)
// ─────────────────────────────────────────────

/** @deprecated Gunakan fetchRegulasiList + fetchCategoryRegulasi */
export const KEBIJAKAN_ENDPOINTS = {
  presiden: '/peraturan/presiden',
  mentri: '/peraturan/mentri',
  pedoman: '/peraturan/pedoman',
  walikota: '/peraturan/walikota',
  keputusan: '/peraturan/keputusan'
};

/** @deprecated Gunakan fetchCategoryRegulasi untuk label dinamis */
export const KEBIJAKAN_LABELS = {
  presiden: 'Peraturan Presiden',
  mentri: 'Peraturan Menteri',
  pedoman: 'Pedoman Menteri',
  walikota: 'Peraturan Walikota',
  keputusan: 'Keputusan Walikota'
};

/** @deprecated Ikon statis — gunakan data dari API */
export const KEBIJAKAN_ICONS = {
  presiden: '🏛️',
  mentri: '📋',
  pedoman: '📘',
  walikota: '🏢',
  keputusan: '📜'
};

/** @deprecated Gunakan fetchRegulasiList() */
export const fetchKebijakan = async (type) => {
  if (!KEBIJAKAN_ENDPOINTS[type]) {
    throw new Error(`Kategori kebijakan tidak valid: ${type}`);
  }
  try {
    const data = await secureFetch(KEBIJAKAN_ENDPOINTS[type], {
      method: 'GET',
      timeout: 10000,
      retries: 1,
    });
    return data;
  } catch (error) {
    logger.error(`fetchKebijakan(${type})`, error);
    throw error;
  }
};

/** @deprecated Gunakan fetchRegulasiList() + fetchCategoryRegulasi() */
export const fetchAllRegulasi = async () => {
  const types = Object.keys(KEBIJAKAN_ENDPOINTS);
  const results = await Promise.allSettled(
    types.map((type) => fetchKebijakan(type))
  );
  const regulasi = {};
  types.forEach((type, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      regulasi[type] = {
        status: 'success',
        data: Array.isArray(result.value) ? result.value : (result.value?.data || []),
        error: null,
      };
    } else {
      regulasi[type] = {
        status: 'error',
        data: [],
        error: result.reason?.message || 'Gagal memuat data',
      };
    }
  });
  return regulasi;
};

