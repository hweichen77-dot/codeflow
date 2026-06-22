import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

// https://vite.dev/config/
// Desktop (Tauri) loads assets from the bundle root; GitHub Pages serves under /codeflow/.
const base = process.env.VITE_BASE ?? '/codeflow/'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

export default defineConfig({
  base,
  define: {
    // Exposed to monitoring as the Sentry release tag.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
          // All third-party code in a single vendor chunk. React was previously
          // split into its own `vendor-react` chunk, but that created a cross-chunk
          // circular init (vendor read `React.forwardRef` before vendor-react had
          // initialized its React export → white-screen on load). Keeping React in
          // the same chunk as its consumers makes the import intra-chunk and removes
          // the ordering hazard entirely.
          if (id.includes('node_modules')) {
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
