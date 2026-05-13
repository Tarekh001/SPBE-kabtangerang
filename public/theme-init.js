/**
 * Theme Initialization Script (Dark Mode Flash Prevention)
 * ========================================================
 * Script ini dijalankan sebelum React mount untuk mencegah
 * flash of unstyled content (FOUC) saat dark mode aktif.
 *
 * Dipindahkan dari inline <script> agar kompatibel dengan
 * Content Security Policy (CSP) script-src 'self'.
 */
(function () {
  try {
    var t = localStorage.getItem('spbe-theme');
    if (
      t === 'dark' ||
      (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Graceful fallback jika localStorage tidak tersedia (private browsing, dll)
  }
})();
