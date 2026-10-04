import { defineConfig, type Plugin } from 'vite';
import { resolve, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { CONVERTERS, LEGAL_PAGES, SITE_ORIGIN, canonicalUrl, converterBySlug } from './src/site';

// ESM has no root.
const root = fileURLToPath(new URL('.', import.meta.url));

// Every HTML entry: the React home page plus each static page in pages/.
const PAGE_FILES = readdirSync(resolve(root, 'pages')).filter((f) => f.endsWith('.html'));

// Vite emits multi-page entries at dist/pages/<name>.html; Cloudflare Pages
// should serve them at /<name>. Flatten them into dist/ after the build.
function flattenPages(): Plugin {
  return {
    name: 'flatten-pages',
    apply: 'build',
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

/** "/" for index.html, "/<name>" for pages/<name>.html. */
function pagePath(filename: string): string {
  const name = basename(filename, '.html');
  return name === 'index' ? '/' : `/${name}`;
}

/** Date (YYYY-MM-DD) of the last commit that touched a file; today if it has uncommitted edits. */
function lastModified(file: string): string {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: root }).toString().trim();
    if (dirty) return today;
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root }).toString().trim();
    return date || today;
  } catch {
    return today;
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function setLink(html: string, rel: string, href: string): string {
  const tag = `<link rel="${rel}" href="${href}" />`;
  const re = new RegExp(`<link rel="${rel}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace('</title>', `</title>\n${tag}`);
}

function setMetaProperty(html: string, attr: 'property' | 'name', key: string, value: string): string {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  return re.test(html) ? html.replace(re, `<meta ${attr}="${key}" content="${value}">`) : html;
}

function relatedBlock(slug: string): string {
  const c = converterBySlug(slug)!;
  const links = c.related.map((r) => {
    const t = converterBySlug(r);
    if (!t) throw new Error(`site.ts: ${slug} relates to unknown converter "${r}"`);
    return `      <a href="/${t.slug}">${esc(t.anchor)} <span>${esc(t.blurb)}</span></a>`;
  });
  return `<h2>Related converters</h2>\n    <div class="related">\n${links.join('\n')}\n    </div>`;
}

function footerBlock(): string {
  const links = CONVERTERS.map((c) => `    <a href="/${c.slug}">${esc(c.label)}</a>`).join('\n');
  return `<footer class="site">
  <div class="wrap">
    <a href="/">Compressly home</a>
${links}
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
    <div class="copy">© ${new Date().getFullYear()} Compressly. Compresses your images — not your privacy.</div>
  </div>
</footer>`;
}

function softwareApplicationLd(html: string, url: string): string {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const name = title.replace(/\s*\|\s*Compressly\s*$/, '').split(' — ')[0];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Compressly ${name}`,
    url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
  return `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`;
}

/**
 * SEO wiring for every HTML page, driven by src/site.ts:
 * canonical + og:url + twitter:url, and on converter pages the Related
 * converters block, the footer and SoftwareApplication JSON-LD. Also writes
 * sitemap.xml from the same page list.
 */
function seo(): Plugin {
  let isSsr = false;
  return {
    name: 'compressly-seo',
    configResolved(c) { isSsr = !!c.build.ssr; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const path = pagePath(ctx.filename);
        const noindex = /<meta name="robots" content="noindex/.test(html);
        if (!noindex) {
          const url = canonicalUrl(path);
          html = setLink(html, 'canonical', url);
          html = setMetaProperty(html, 'property', 'og:url', url);
          html = setMetaProperty(html, 'name', 'twitter:url', url);
        }

        const slug = path.slice(1);
        if (converterBySlug(slug)) {
          html = html.replace(/<h2>[^<]*<\/h2>\s*<div class="related">[\s\S]*?<\/div>/, relatedBlock(slug));
          html = html.replace(/<footer class="site">[\s\S]*?<\/footer>/, footerBlock());
          html = html.replace('</head>', `${softwareApplicationLd(html, canonicalUrl(path))}\n</head>`);
        }
        return html;
      },
    },
    closeBundle() {
      if (isSsr) return;
      const entries = [
        { loc: canonicalUrl('/'), file: 'index.html', priority: '1.0' },
        ...CONVERTERS.map((c) => ({ loc: canonicalUrl(c.slug), file: `pages/${c.slug}.html`, priority: '0.8' })),
        ...LEGAL_PAGES.map((p) => ({ loc: canonicalUrl(p), file: `pages/${p}.html`, priority: '0.3' })),
      ];
      for (const e of entries) {
        if (!existsSync(resolve(root, e.file))) throw new Error(`sitemap: ${e.file} does not exist`);
      }
      const body = entries
        .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${lastModified(e.file)}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`)
        .join('\n');
      writeFileSync(
        resolve(root, 'dist/sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), seo(), flattenPages()],
  // Cross-origin isolation headers in dev so multi-threaded WASM (AVIF/JXL MT
  // codecs) can spawn workers via SharedArrayBuffer.
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
  // The prerender bundle runs in plain Node; bundle CJS deps (file-saver,
  // jszip) instead of importing them as ESM.
  ssr: { noExternal: true },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@jsquash/avif', '@jsquash/jpeg', '@jsquash/jxl', '@jsquash/png', '@jsquash/webp', '@jsquash/resize'] },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          // Multi-page: each landing page is a real HTML document (crawlable
          // without JS) that also mounts the compressor via src/embed.tsx.
          input: {
            main: resolve(root, 'index.html'),
            ...Object.fromEntries(PAGE_FILES.map((f) => [basename(f, '.html'), resolve(root, 'pages', f)])),
          },
        },
  },
}));
