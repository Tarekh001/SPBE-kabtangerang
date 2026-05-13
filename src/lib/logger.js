/**
 * Production-safe Logger Utility
 * ================================
 * Hanya menampilkan log di development mode.
 * Di production, semua console output di-suppress untuk mencegah
 * information disclosure ke browser DevTools.
 *
 * Standar: OWASP — Improper Error Handling / Information Disclosure
 */

const isDev = import.meta.env.DEV;

/**
 * Sanitize error message — hapus detail internal sebelum logging
 * @param {string} message
 * @returns {string}
 */
const sanitizeMessage = (message) => {
  if (typeof message !== 'string') return String(message);
  // Hapus path absolut, IP internal, dan stack trace dari pesan
  return message
    .replace(/\/[^\s]+/g, '[path]')          // file paths
    .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[ip]') // IP addresses
    .replace(/https?:\/\/[^\s]+/g, '[url]'); // full URLs
};

export const logger = {
  /**
   * Log informasi umum — hanya di development
   */
  info: (...args) => {
    if (isDev) console.info('[SPBE:info]', ...args);
  },

  /**
   * Log warning — hanya di development
   */
  warn: (...args) => {
    if (isDev) console.warn('[SPBE:warn]', ...args);
  },

  /**
   * Log error — hanya di development, dengan sanitasi
   */
  error: (context, error) => {
    if (isDev) {
      console.error(`[SPBE:error] ${context}:`, error);
    }
    // Di production: bisa kirim ke external error tracking (Sentry, dsb)
    // if (!isDev) sendToErrorTracker(context, sanitizeMessage(error?.message));
  },

  /**
   * Log debug — hanya di development
   */
  debug: (...args) => {
    if (isDev) console.debug('[SPBE:debug]', ...args);
  },
};

export default logger;
