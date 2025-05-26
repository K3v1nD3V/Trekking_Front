import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
      '@': resolve(__dirname, './src'),
    },
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
