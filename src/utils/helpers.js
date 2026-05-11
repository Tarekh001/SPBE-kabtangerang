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

/**
 * Fungsi untuk mengambil data Kebijakan SPBE berdasarkan kategorinya.
 * Menggunakan native fetch (tanpa axios).
 *
 * @param {string} type - Harus bernilai antara: "presiden", "mentri", "pedoman", "walikota", "keputusan"
 * @returns {Promise<Array>} Data kebijakan
 */
export const fetchKebijakan = async (type) => {
  try {
    // 1. Validasi parameter tipe kategori kebijakan
    if (!KEBIJAKAN_ENDPOINTS[type]) {
      throw new Error(`Kategori kebijakan tidak valid: ${type}`);
    }

    // 2. Mengambil base URL dari environment variable (Vite environment)
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    if (!baseUrl) {
      console.warn("Peringatan: VITE_API_BASE_URL kosong atau belum ter-load dari .env");
    }

    // Pembersihan Base URL: Hapus karakter '/' di belakang URL
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = KEBIJAKAN_ENDPOINTS[type];

    // 3. Merakit full koneksi URL Endpoint
    const fullUrl = `${cleanBaseUrl}${endpoint}`;

    // 4. Memanggil API menggunakan native fetch
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5. Mengembalikan data JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // 6. Penanganan error global API
    console.error(`[fetchKebijakan] Gagal mengambil data untuk kategori "${type}":`, error.message);

    // Error dilemparkan kembali agar frontend bisa merespon dengan UI Alert/Feedback khusus
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
