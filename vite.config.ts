import { defineConfig, loadEnv } from 'vite';
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

function isHttpsUrl(s: string) {
  try {
    return new URL(s).protocol === 'https:';
  } catch {
    return false;
  }
}

// A production build without a real Lemon Squeezy checkout URL ships a dead
// "Get Pro" button, so refuse to build. `vite dev` is unaffected.
function requireCheckoutUrl() {
  return {
    name: 'require-checkout-url',
    apply: 'build' as const,
    config(_: unknown, { mode }: { mode: string }) {
      const url = loadEnv(mode, root, 'VITE_').VITE_LS_CHECKOUT_URL?.trim();
      let problem = '';
      if (!url) problem = 'is not set';
      else if (/YOUR-STORE|REPLACE_PRODUCT_ID/.test(url)) problem = 'still holds the .env.example placeholder';
      else if (!isHttpsUrl(url)) problem = `is not an https URL: ${url}`;
      if (problem) {
        throw new Error(
          `VITE_LS_CHECKOUT_URL ${problem}. Set it in .env (local) or the ` +
            'Cloudflare Pages build environment to your Lemon Squeezy buy link.',
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), flattenPages(), requireCheckoutUrl()],
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
