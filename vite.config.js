import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7787,
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: () =>
          '/macros/s/AKfycbxPD0D6vjnZ4FHCr4t8JWyu0XwJINb3do5jPSTwN_QZXInQkbwBSgwnDTlzYmui-WE0iw/exec',
      },
    },
  },
})
