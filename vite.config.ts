import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ESM has no root.
const root = fileURLToPath(new URL('.', import.meta.url));
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Cross-origin isolation headers in dev so multi-threaded WASM (AVIF/JXL MT
// codecs) can spawn workers via SharedArrayBuffer.
// Vite emits multi-page entries at dist/pages/<name>.html; Cloudflare Pages
// should serve them at /<name>. Flatten them into dist/ after the build.
function flattenPages() {
  return {
    name: 'flatten-pages',
    closeBundle() {
      const dir = resolve(root, 'dist/pages');
      if (!existsSync(dir)) return;
      for (const f of readdirSync(dir)) {
        renameSync(resolve(dir, f), resolve(root, 'dist', f));
      }
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), flattenPages()],
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
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      // Multi-page: each landing page is a real HTML document (crawlable
      // without JS) that also mounts the compressor via src/embed.tsx.
      input: {
        main: resolve(root, 'index.html'),
        'png-to-webp': resolve(root, 'pages/png-to-webp.html'),
        'jpg-to-webp': resolve(root, 'pages/jpg-to-webp.html'),
        'webp-to-png': resolve(root, 'pages/webp-to-png.html'),
        'webp-to-jpg': resolve(root, 'pages/webp-to-jpg.html'),
        'compress-webp': resolve(root, 'pages/compress-webp.html'),
        'png-to-avif': resolve(root, 'pages/png-to-avif.html'),
        'jpg-to-avif': resolve(root, 'pages/jpg-to-avif.html'),
        'avif-to-jpg': resolve(root, 'pages/avif-to-jpg.html'),
        'avif-to-png': resolve(root, 'pages/avif-to-png.html'),
        'avif-converter': resolve(root, 'pages/avif-converter.html'),
      },
    },
  },
});
