import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Cross-origin isolation headers in dev so multi-threaded WASM (AVIF/JXL MT
// codecs) can spawn workers via SharedArrayBuffer.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@jsquash/avif', '@jsquash/jpeg', '@jsquash/jxl', '@jsquash/png', '@jsquash/webp', '@jsquash/resize'] },
  build: { target: 'es2022', sourcemap: false },
});
