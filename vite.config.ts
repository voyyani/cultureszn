import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Note: API endpoints are deployed to Vercel as serverless functions
  // In development, API calls will fail and automatically fall back to static data
  // To test with live API, use: vercel dev
})
