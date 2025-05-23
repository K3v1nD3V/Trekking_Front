import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://trekking-back.onrender.com',
        changeOrigin: true,
        secure: true, // Cambia esto a `true` para forzar la verificación SSL
      },
    },
  },
});
