#!/usr/bin/env node
/**
 * Push every URL in public/sitemap.xml to IndexNow.
 *
 * IndexNow notifies Bing (and therefore ChatGPT search and Copilot, which are
 * Bing-backed) plus Yandex and Seznam within minutes, instead of waiting for a
 * crawl. Google does not participate.
 *
 * The key file must stay reachable at https://getcompressly.com/<key>.txt —
 * it lives in public/ and ships with every deploy.
 *
 * Usage: node scripts/indexnow.mjs [url ...]
 *   No args  → submits every URL in the sitemap.
 *   With args → submits only those URLs (useful after changing one page).
 */
import { readFileSync, readdirSync } from 'node:fs';

const HOST = 'getcompressly.com';

const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file found in public/ (expected <32 hex chars>.txt)');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');

const urls = process.argv.length > 2
  ? process.argv.slice(2)
  : [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urls.length) {
  console.error('Nothing to submit.');
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  }),
});

console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urls.length} URL(s)`);
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
