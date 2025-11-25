import { defineConfig } from 'vite'

// Vite dev server proxy to forward /api requests to backend running on localhost:4000
// This keeps the frontend running on Vite while calling the local Express API without CORS hassles.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        // preserve the path, Vite will forward /api/foo -> http://localhost:4000/api/foo
      },
    },
  },
})
