#!/usr/bin/env node
/**
 * Writes the server-rendered home page into dist/index.html.
 * Runs after `vite build` and `vite build --ssr src/entry-server.tsx`.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ssrDir = resolve('dist-ssr');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

const file = resolve('dist/index.html');
const html = readFileSync(file, 'utf8');
if (!html.includes('<!--app-html-->')) {
  console.error('prerender: <!--app-html--> placeholder not found in dist/index.html');
  process.exit(1);
}
const app = render();
writeFileSync(file, html.replace('<!--app-html-->', app));
rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${(app.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
