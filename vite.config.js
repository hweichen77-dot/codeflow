import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
// Desktop (Tauri) loads assets from the bundle root; GitHub Pages serves under /codeflow/.
const base = process.env.VITE_BASE ?? '/codeflow/'

export default defineConfig({
  base,
  logLevel: 'warn', // Show chunk-size and other build warnings, not just errors
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core framework in its own long-lived, cacheable vendor chunk.
          if (id.includes('node_modules')) {
            if (
              id.includes('react-router') ||
              id.includes('/react-dom/') ||
              id.includes('/react/') ||
              id.includes('/scheduler/')
            ) {
              return 'vendor-react'
            }
            return 'vendor'
          }
          // Curriculum content (~3MB) split into its own chunk(s) so it never
          // lands in the initial bundle. One chunk per curriculum module keeps
          // any single chunk small; the rest of the content barrel groups together.
          if (id.includes('/src/content/curriculum/')) {
            const m = id.match(/module-(\d+)/)
            return m ? `curriculum-module-${m[1]}` : 'curriculum'
          }
          if (id.includes('/src/content/competitive/')) {
            return 'curriculum-competitive'
          }
          if (id.includes('/src/content/')) {
            return 'curriculum'
          }
        },
      },
    },
  },
})
