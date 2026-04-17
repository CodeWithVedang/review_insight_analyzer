import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect which backend port to use (8001 or 8002)
const backendPort = process.env.BACKEND_PORT || '8001'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api_internal': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
        rewrite: (path) => path.replace(/^\/api_internal/, ''),
      },
    },
  }
})
