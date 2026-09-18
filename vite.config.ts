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
})
