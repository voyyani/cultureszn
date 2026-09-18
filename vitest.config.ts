import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import mdxMeta from './scripts/lib/mdx-meta-plugin.mjs'
import path from 'node:path'

export default defineConfig({
  plugins: [mdxMeta(), { enforce: 'pre', ...mdx({ jsxImportSource: 'react' }) }, react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts', 'scripts/**/*.test.mjs'],
    restoreMocks: true,
  },
})
