import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ══ Security Hardening — Build Configuration ══
  build: {
    // CRITICAL: Jangan generate source map di production
    // Source map mengekspos seluruh source code ke browser DevTools
    sourcemap: false,

    // Minify output untuk mempersulit reverse-engineering
    minify: 'terser',
    terserOptions: {
      compress: {
        // Hapus semua console.* dan debugger di production build
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Konfigurasi output — hindari expose struktur kode internal
    rollupOptions: {
      output: {
        // Hash-based filenames untuk cache busting
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
  },

  // ══ Security Hardening — Dev Server ══
  server: {
    // Security headers untuk development server
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  // ══ Preview Server (vite preview) ══
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})

