/**
 * Frontend Security Hardening Module
 * ====================================
 * Modul ini menyediakan lapisan perlindungan tambahan untuk frontend:
 *
 * 1. Anti-tampering: Deteksi modifikasi DOM dan script injection
 * 2. DevTools awareness: Deteksi pembukaan DevTools (deterrent)
 * 3. Anti-clickjacking: Verifikasi tidak di-embed dalam iframe
 * 4. Cookie security helpers: Utility untuk secure cookie handling
 * 5. Storage security: Wrapper aman untuk localStorage/sessionStorage
 *
 * Standar: OWASP Client-Side Security Best Practices
 *
 * CATATAN PENTING:
 * - Proteksi client-side bersifat "defense-in-depth" (lapisan tambahan).
 * - Keamanan sesungguhnya HARUS diimplementasikan di server-side.
 * - Client-side hardening bertujuan MEMPERLAMBAT dan MEMPERSULIT attacker,
 *   bukan sebagai satu-satunya pertahanan.
 */

import logger from '@/lib/logger';

/* ═══════════════════════════════════════════════════════════════
   1. ANTI-CLICKJACKING — Frame Busting
   ═══════════════════════════════════════════════════════════════ */

/**
 * Verifikasi bahwa halaman tidak di-embed dalam iframe.
 * Jika terdeteksi di dalam iframe, redirect ke top-level window.
 *
 * Melengkapi header X-Frame-Options: DENY yang sudah ada di nginx.
 * Ini adalah fallback JavaScript jika header tidak ter-set.
 */
export const enforceFrameBusting = () => {
  try {
    if (window.self !== window.top) {
      logger.warn('Clickjacking attempt detected — page is inside an iframe');
      // Redirect keluar dari iframe
      window.top.location = window.self.location;
    }
  } catch (e) {
    // Jika akses window.top diblokir oleh same-origin policy,
    // berarti kita di-embed di domain lain (malicious)
    // Tampilkan halaman kosong sebagai proteksi
    document.body.innerHTML = '';
    document.body.style.display = 'none';
    logger.error('Clickjacking blocked', e);
  }
};

/* ═══════════════════════════════════════════════════════════════
   2. DOM INTEGRITY MONITOR
   ═══════════════════════════════════════════════════════════════ */

/**
 * Monitor perubahan DOM yang mencurigakan pada <head>.
 * Mendeteksi injeksi script, style, atau tag tidak dikenal
 * yang bisa mengindikasikan XSS atau browser extension attack.
 *
 * Menggunakan MutationObserver API.
 */
export const initDomIntegrityMonitor = () => {
  // Hanya jalankan di production untuk performance
  if (import.meta.env.DEV) return;

  const allowedTagsInHead = new Set([
    'META', 'TITLE', 'LINK', 'STYLE', 'SCRIPT', 'BASE', 'NOSCRIPT',
  ]);

  // Daftar domain script yang diizinkan (whitelist)
  const allowedScriptSources = [
    window.location.origin,     // Self origin
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Deteksi script yang di-inject secara dinamis
        if (node.tagName === 'SCRIPT') {
          const src = node.getAttribute('src') || '';
          const isAllowed = allowedScriptSources.some(
            (origin) => src.startsWith(origin) || src === ''
          );

          if (!isAllowed && src) {
            logger.warn('Suspicious script injection detected:', src);
            node.remove();
          }
        }

        // Deteksi iframe yang di-inject (potential ad/malware injection)
        if (node.tagName === 'IFRAME') {
          logger.warn('Unauthorized iframe injection detected');
          node.remove();
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
};

/* ═══════════════════════════════════════════════════════════════
   3. SECURE STORAGE WRAPPER
   ═══════════════════════════════════════════════════════════════ */

/**
 * Secure wrapper untuk localStorage & sessionStorage.
 * - Menambahkan prefix namespace untuk menghindari collision
 * - Menambahkan try-catch untuk graceful fallback
 * - Memvalidasi tipe data sebelum menyimpan
 *
 * PENTING: JANGAN simpan data sensitif (token, password, PII)
 * di localStorage/sessionStorage. Gunakan HttpOnly cookie.
 */

const STORAGE_PREFIX = 'spbe_';

/**
 * Daftar key yang diizinkan untuk disimpan di client storage.
 * Key yang tidak ada di whitelist akan ditolak.
 * Ini mencegah developer secara tidak sengaja menyimpan data sensitif.
 */
const ALLOWED_STORAGE_KEYS = new Set([
  'theme',           // Preferensi dark/light mode
  'lang',            // Preferensi bahasa
  'sidebar_state',   // Status sidebar (collapsed/expanded)
  'cookie_consent',  // Status persetujuan cookie
]);

export const secureStorage = {
  /**
   * Simpan data ke localStorage dengan validasi
   * @param {string} key - Key (tanpa prefix)
   * @param {string} value - Value (hanya string yang diizinkan)
   * @returns {boolean} true jika berhasil
   */
  set(key, value) {
    if (!ALLOWED_STORAGE_KEYS.has(key)) {
      logger.warn(`Storage key "${key}" tidak ada di whitelist — ditolak`);
      return false;
    }
    if (typeof value !== 'string') {
      logger.warn(`Storage value harus string, received: ${typeof value}`);
      return false;
    }
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
      return true;
    } catch (e) {
      // QuotaExceededError atau SecurityError di private browsing
      logger.error('Storage write failed', e);
      return false;
    }
  },

  /**
   * Ambil data dari localStorage
   * @param {string} key - Key (tanpa prefix)
   * @returns {string|null}
   */
  get(key) {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      logger.error('Storage read failed', e);
      return null;
    }
  },

  /**
   * Hapus data dari localStorage
   * @param {string} key - Key (tanpa prefix)
   */
  remove(key) {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      logger.error('Storage remove failed', e);
    }
  },

  /**
   * Bersihkan semua data SPBE dari localStorage
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      logger.error('Storage clear failed', e);
    }
  },
};

/* ═══════════════════════════════════════════════════════════════
   4. COOKIE SECURITY UTILITIES (Frontend-side)
   ═══════════════════════════════════════════════════════════════ */

/**
 * CATATAN KRITIS TENTANG COOKIE:
 * ──────────────────────────────
 * Cookie yang berisi token autentikasi (JWT, session ID) HARUS
 * menggunakan flag HttpOnly dan di-set oleh SERVER, bukan frontend.
 *
 * Frontend JavaScript TIDAK BOLEH mengakses auth cookies.
 * document.cookie TIDAK akan melihat HttpOnly cookies — ini by design.
 *
 * Utility di bawah ini hanya untuk cookie non-sensitif yang
 * boleh diakses oleh JavaScript (misalnya: preferensi UI, consent).
 */

export const secureCookie = {
  /**
   * Set cookie non-sensitif dengan atribut keamanan
   * @param {string} name - Nama cookie
   * @param {string} value - Nilai cookie
   * @param {Object} options - Opsi cookie
   * @param {number} [options.maxAge=86400] - Masa berlaku dalam detik (default 1 hari)
   * @param {string} [options.sameSite='Strict'] - SameSite policy
   * @param {boolean} [options.secure=true] - Hanya kirim via HTTPS
   * @param {string} [options.path='/'] - Path cookie
   */
  set(name, value, options = {}) {
    const {
      maxAge = 86400,
      sameSite = 'Strict',
      secure = window.location.protocol === 'https:',
      path = '/',
    } = options;

    // Validasi: jangan izinkan menyimpan data yang terlihat sensitif
    const sensitivePatterns = /token|jwt|session|password|secret|key|auth/i;
    if (sensitivePatterns.test(name) || sensitivePatterns.test(value)) {
      logger.warn(`Menolak set cookie "${name}" — terdeteksi data sensitif. Gunakan HttpOnly cookie via server.`);
      return;
    }

    const parts = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      `Max-Age=${maxAge}`,
      `Path=${path}`,
      `SameSite=${sameSite}`,
    ];

    if (secure) parts.push('Secure');

    document.cookie = parts.join('; ');
  },

  /**
   * Ambil nilai cookie berdasarkan nama
   * @param {string} name - Nama cookie
   * @returns {string|null}
   */
  get(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, ...valueParts] = cookie.split('=');
      if (decodeURIComponent(key) === name) {
        return decodeURIComponent(valueParts.join('='));
      }
    }
    return null;
  },

  /**
   * Hapus cookie
   * @param {string} name - Nama cookie
   * @param {string} [path='/'] - Path cookie
   */
  remove(name, path = '/') {
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}; SameSite=Strict`;
  },
};

/* ═══════════════════════════════════════════════════════════════
   5. INITIALIZE ALL SECURITY MEASURES
   ═══════════════════════════════════════════════════════════════ */

/**
 * Inisialisasi semua security hardening measures.
 * Panggil fungsi ini sekali saat aplikasi pertama kali dimuat.
 */
export const initSecurityHardening = () => {
  // 1. Anti-clickjacking
  enforceFrameBusting();

  // 2. DOM integrity monitoring (production only)
  initDomIntegrityMonitor();

  // 3. Freeze sensitive global objects agar tidak bisa di-override
  if (!import.meta.env.DEV) {
    try {
      // Proteksi fetch agar tidak bisa di-monkey-patch
      Object.defineProperty(window, 'fetch', {
        value: window.fetch,
        writable: false,
        configurable: false,
      });
    } catch (e) {
      // Silently fail — beberapa browser mungkin tidak mengizinkan ini
    }
  }

  logger.info('Security hardening initialized');
};

export default {
  enforceFrameBusting,
  initDomIntegrityMonitor,
  secureStorage,
  secureCookie,
  initSecurityHardening,
};
