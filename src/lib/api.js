/**
 * Secure Fetch API Wrapper
 * =========================
 * Reusable, production-hardened fetch wrapper dengan:
 * - AbortController timeout
 * - Response type validation
 * - JSON content-type validation
 * - Sanitized error handling
 * - Retry-safe architecture
 *
 * Standar: OWASP — Insecure API Consumption
 */

import logger from '@/lib/logger';

/** Default request timeout dalam milidetik */
const DEFAULT_TIMEOUT_MS = 15000;

/** Jumlah maksimal retry untuk request yang gagal */
const MAX_RETRIES = 2;

/** HTTP status code yang boleh di-retry */
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Mendapatkan base URL API dari environment variable secara aman.
 * Menghapus trailing slash untuk konsistensi.
 * @returns {string} Base URL yang sudah dibersihkan
 */
const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  if (!baseUrl) {
    logger.warn('VITE_API_BASE_URL belum dikonfigurasi');
  }
  return baseUrl.replace(/\/+$/, '');
};

/**
 * Validasi apakah response memiliki content-type JSON
 * @param {Response} response
 * @returns {boolean}
 */
const isJsonResponse = (response) => {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json');
};

/**
 * Delay utility untuk retry backoff
 * @param {number} ms - Milidetik untuk menunggu
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Secure fetch wrapper dengan timeout, validation, dan retry.
 *
 * @param {string} endpoint - Path endpoint API (contoh: '/peraturan/presiden')
 * @param {Object} [options={}] - Konfigurasi tambahan
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers={}] - Custom headers
 * @param {Object|null} [options.body=null] - Request body (akan di-JSON.stringify)
 * @param {number} [options.timeout=15000] - Timeout dalam milidetik
 * @param {number} [options.retries=2] - Jumlah retry jika gagal
 * @param {string} [options.credentials='same-origin'] - Credentials mode
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} Dengan pesan yang aman untuk production
 */
export const secureFetch = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    // 'include' agar HttpOnly cookies otomatis dikirim ke server
    // Ini WAJIB untuk cookie-based authentication
    credentials = 'include',
  } = options;

  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${endpoint}`;
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Buat AbortController baru per attempt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Log hanya di development
      logger.debug(`API Request [${method}] ${endpoint} (attempt ${attempt + 1})`);

      const fetchOptions = {
        method,
        headers: {
          'Accept': 'application/json',
          ...headers,
          // Tambahkan Content-Type hanya jika ada body
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        credentials,
        signal: controller.signal,
        // Stringify body jika ada
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      const response = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);

      // Cek apakah response OK (status 200-299)
      if (!response.ok) {
        const statusCode = response.status;

        // Jika status retryable dan masih ada attempt, retry
        if (RETRYABLE_STATUS_CODES.includes(statusCode) && attempt < retries) {
          logger.warn(`Retryable error ${statusCode}, retrying in ${(attempt + 1) * 1000}ms...`);
          await delay((attempt + 1) * 1000); // exponential backoff
          continue;
        }

        throw new Error(`Request gagal dengan status ${statusCode}`);
      }

      // Validasi content-type harus JSON
      if (!isJsonResponse(response)) {
        throw new Error('Response bukan format JSON yang valid');
      }

      // Parse dan return data JSON
      const data = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // Handle AbortError (timeout)
      if (error.name === 'AbortError') {
        lastError = new Error('Request timeout — server tidak merespons');
        logger.error('Request Timeout', { endpoint, timeout });

        if (attempt < retries) {
          await delay((attempt + 1) * 1000);
          continue;
        }
        break;
      }

      // Handle network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        lastError = new Error('Koneksi jaringan gagal');
        logger.error('Network Error', { endpoint });

        if (attempt < retries) {
          await delay((attempt + 1) * 1000);
          continue;
        }
        break;
      }

      // Error lainnya — log dan throw
      logger.error('API Error', { endpoint, message: error.message });
      break;
    }
  }

  // Jika semua retry habis, throw error terakhir
  throw lastError || new Error('Request gagal setelah beberapa percobaan');
};

export default secureFetch;
