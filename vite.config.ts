import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import mdxMeta from './scripts/lib/mdx-meta-plugin.mjs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [mdxMeta(), { enforce: 'pre', ...mdx({ jsxImportSource: 'react' }) }, react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Function form: applies only to bundled modules, so the SSR build (React external) is unaffected.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) return 'react'
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
  esbuild: { drop: ['console', 'debugger'] },
})
