/**
 * Mapping kategori kebijakan ke endpoint API spesifik
 */
export const KEBIJAKAN_ENDPOINTS = {
  presiden: '/peraturan/presiden',
  mentri: '/peraturan/mentri',
  pedoman: '/peraturan/pedoman',
  walikota: '/peraturan/walikota',
  keputusan: '/peraturan/keputusan'
};

/**
 * Label yang ditampilkan di UI untuk setiap kategori
 */
export const KEBIJAKAN_LABELS = {
  presiden: 'Peraturan Presiden',
  mentri: 'Peraturan Menteri',
  pedoman: 'Pedoman Menteri',
  walikota: 'Peraturan Walikota',
  keputusan: 'Keputusan Walikota'
};

/**
 * Icon identifiers untuk setiap kategori regulasi
 */
export const KEBIJAKAN_ICONS = {
  presiden: '🏛️',
  mentri: '📋',
  pedoman: '📘',
  walikota: '🏢',
  keputusan: '📜'
};

import { secureFetch } from '@/lib/api';
import logger from '@/lib/logger';

/**
 * Fungsi untuk mengambil data Kebijakan SPBE berdasarkan kategorinya.
 * Menggunakan secure fetch wrapper dengan timeout, retry, dan validasi.
 *
 * @param {string} type - Harus bernilai antara: "presiden", "mentri", "pedoman", "walikota", "keputusan"
 * @returns {Promise<Array>} Data kebijakan
 */
export const fetchKebijakan = async (type) => {
  // 1. Validasi parameter tipe kategori kebijakan
  if (!KEBIJAKAN_ENDPOINTS[type]) {
    throw new Error(`Kategori kebijakan tidak valid: ${type}`);
  }

  try {
    const endpoint = KEBIJAKAN_ENDPOINTS[type];

    // 2. Memanggil API menggunakan secure fetch wrapper
    //    (timeout, retry, validasi JSON sudah built-in)
    const data = await secureFetch(endpoint, {
      method: 'GET',
      timeout: 10000, // 10 detik timeout per request
      retries: 1,     // 1x retry jika gagal
    });

    return data;
  } catch (error) {
    // 3. Penanganan error — hanya log di development
    logger.error(`fetchKebijakan(${type})`, error);

    // Error dilemparkan kembali agar frontend bisa merespon dengan UI feedback
    throw error;
  }
};

/**
 * Fungsi untuk mengambil SEMUA kategori regulasi secara parallel.
 * Menggunakan Promise.allSettled agar satu kegagalan tidak menghentikan yang lain.
 *
 * @returns {Promise<Object>} Object dengan key kategori dan value { status, data, error }
 */
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

