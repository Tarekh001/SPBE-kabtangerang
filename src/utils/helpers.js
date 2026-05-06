import axios from 'axios';

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
 * Fungsi untuk mengambil data Kebijakan SPBE berdasarkan kategorinya.
 * 
 * @param {string} type - Harus bernilai antara: "presiden", "mentri", "pedoman", "walikota", "keputusan"
 * @returns {Promise<Array>} Data kebijakan (Format standar: [{ id, judul, nomor, tahun, link }])
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

    // Pembersihan Base URL: Hapus karakter '/' di belakang URL jika ada, agar mencegah double-slash "api/v1//peraturan/..."
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = KEBIJAKAN_ENDPOINTS[type];
    
    // 3. Merakit full koneksi URL Endpoint
    const fullUrl = `${cleanBaseUrl}${endpoint}`;

    // 4. Memanggil API menggunakan axios
    const response = await axios.get(fullUrl);

    // 5. Mengembalikan data JSON
    // Seringkali REST API membungkus data utama, ubah bagian ini (misal menjadi response.data.data) sesuai bentuk struktur sejati dari Backend Anda.
    return response.data;
  } catch (error) {
    // 6. Penanganan error global API
    console.error(`[fetchKebijakan] Gagal mengambil data untuk kategori "${type}":`, error.message);
    
    // Error dilemparkan kembali agar frontend bisa merespon dengan UI Alert/Feedback khusus
    throw error;
  }
};
