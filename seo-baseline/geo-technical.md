# Technical Foundations — getcompressly.com

Audit date: 2026-09-04 (launch day) · Auditor: geo-technical subagent · Method: raw-HTML fetch (curl, no JS) + header inspection + one real-browser render for contrast · Fetch path: apex responded on every try this session; `compressly-3wn.pages.dev` cross-checked and confirmed byte-identical (6,047-byte index, same headers, same soft-404 behaviour).

**Technical Score: 63/100** — Needs Work

The five conversion landing pages are technically well built (fully static, 650–725 words each, self-canonical, JSON-LD in raw HTML, 15–16 internal links). The score is dragged down by three things: the homepage — the brand entity page, the only page carrying pricing/features/FAQ, sitemap priority 1.0 — ships as an empty `<div id="root">` and is invisible to every non-JS crawler; the deployment has no `404.html`, so every unknown path (including the `og.png`, `favicon.ico` and `apple-touch-icon.png` the homepage itself references) returns **200 + the homepage HTML**; and `www` is a live duplicate host with no redirect to the apex.

Outside the technical score but found in passing and more urgent than any SEO item: **the live "Buy Pro" button links to a placeholder URL that 404s** (`https://your-store.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`). See "Enough" section.

### Score Breakdown

| Category | Score | Weight | Weighted | Status |
|---|---|---|---|---|
| Server-Side Rendering / JS dependency | 40/100 | 25% | 10.0 | CRITICAL (homepage) |
| Meta Tags & Indexability | 70/100 | 15% | 10.5 | Warn |
| Crawlability (robots, sitemap, AI bots) | 80/100 | 15% | 12.0 | Pass |
| Security Headers | 72/100 | 10% | 7.2 | Warn |
| Core Web Vitals Risk | 60/100 | 10% | 6.0 | Warn |
| Mobile Optimization | 85/100 | 10% | 8.5 | Pass |
| URL Structure | 80/100 | 5% | 4.0 | Pass |
| Response Headers & Status | 45/100 | 5% | 2.25 | Fail (soft-404) |
| Additional Checks | 55/100 | 5% | 2.75 | Warn |
| **Total** | | | **63.2** | |

SSR rationale: 5 of 6 sitemap URLs are 100% server-rendered; the 6th (homepage) is 0% rendered and is the page that carries brand, product, price and FAQ. Scored at 40 rather than the arithmetic average because the homepage is the page AI engines will fetch when asked "what is Compressly".

---

## Findings ordered by the funnel: FOUND → READ → CITED → ENOUGH

### 1. FOUND — can crawlers discover and index the right URLs?

#### 1.1 robots.txt — Pass
`https://getcompressly.com/robots.txt` → 200, `text/plain`, valid syntax.

```
User-agent: *          Allow: /
User-agent: GPTBot     Allow: /
User-agent: ClaudeBot  Allow: /
User-agent: PerplexityBot  Allow: /
Sitemap: https://getcompressly.com/sitemap.xml
```

No Disallow, no Crawl-delay, sitemap referenced. Live UA test (all → 200, full 6,047-byte HTML): GPTBot, ClaudeBot, Googlebot, PerplexityBot, CCBot. No `X-Robots-Tag` header on any page.

| Crawler | Status | Note |
|---|---|---|
| GPTBot / ClaudeBot / PerplexityBot | Allowed (explicit) | |
| Googlebot / bingbot / Google-Extended / CCBot / Amazonbot / Applebot-Extended / Bytespider / Meta | Allowed (via `*`) | no explicit rules; fine |

#### 1.2 sitemap.xml — Pass with a warning
Valid XML, `application/xml`, 6 URLs, all apex, all 200. Every `<lastmod>` is `2026-07-24` (the first-deploy date, matching the cert `notBefore`). On a 2026-09-04 launch this gives Google/Bing zero change signal — bump lastmod when a page actually changes, and drop `changefreq`/`priority` (ignored). `/privacy` and `/terms` are not in the sitemap (acceptable).

#### 1.3 Duplicate host: `www` is live and never redirects — HIGH
```
https://www.getcompressly.com/            → 200 (own cert CN=www.getcompressly.com)
https://www.getcompressly.com/png-to-webp → 200
http://www.getcompressly.com/             → 301 → https://www.getcompressly.com/ (stops there)
```
Both hosts serve identical HTML with `<link rel="canonical" href="https://getcompressly.com/...">`, so the canonical mitigates indexing of www — but www still absorbs crawl budget, splits any external links that point at www, and AI crawlers that ignore canonicals see two sites. Fix in `public/_redirects` (Cloudflare Pages supports host-level redirects on custom domains):
```
https://www.getcompressly.com/* https://getcompressly.com/:splat 301
```

#### 1.4 Soft-404 on every unknown path — HIGH (also breaks "Cited", see 3.1)
No `404.html` in `dist/`, so Cloudflare Pages runs in SPA-fallback mode and answers every non-file path with `index.html` and **HTTP 200**:

| Path | Status | Content-Type | Bytes |
|---|---|---|---|
| `/og.png` (referenced by og:image on all 6 pages) | 200 | text/html | 6,047 |
| `/favicon.ico` | 200 | text/html | 6,047 |
| `/apple-touch-icon.png` (referenced in homepage `<head>`) | 200 | text/html | 6,047 |
| `/llms.txt`, `/manifest.json`, `/.well-known/indexnow-key.txt` | 200 | text/html | 6,047 |
| `/nonexistent-page-xyz` | 200 | text/html | 6,047 (byte-identical to `/`) |

Confirmed identical on `compressly-3wn.pages.dev`, so it is the platform default, not a zone rule. Consequences: Search Console "Soft 404" reports; unbounded URL space that returns 200 (every typo/bad external link becomes a crawlable duplicate of the homepage); the og:image URL delivers HTML where scrapers expect an image. Fix: add `public/404.html` (any content) — Pages then returns real 404s for unmatched paths; the five landing pages are real files and keep working. Then actually ship `og.png` (1200×630), `favicon.ico` and `apple-touch-icon.png`.

#### 1.5 Landing pages are orphaned from the homepage for non-JS crawlers — HIGH
Raw homepage HTML contains **0 `<a>` elements**. The links to `/png-to-webp`, `/jpg-to-webp`, `/webp-to-png`, `/webp-to-jpg`, `/compress-webp` exist only in `src/components/Footer.tsx`, i.e. after React mounts. Verified: browser-rendered DOM has 7 internal links; curl has none. For GPTBot/ClaudeBot/PerplexityBot the only discovery paths are the sitemap and the landing pages' cross-links to each other (each links to the other four + home). Solved automatically by 2.1; until then the homepage should carry a static nav/footer in `index.html`.

#### 1.6 URL structure — Pass
Clean, lowercase, hyphenated, flat, descriptive slugs; Cloudflare clean-URL normalisation works everywhere:

| Request | Result |
|---|---|
| `http://getcompressly.com/` | 301 → `https://getcompressly.com/` (1 hop) |
| `/index.html` | 308 → `/` |
| `/png-to-webp.html` (and the other 4) | 308 → `/png-to-webp` |
| `/png-to-webp/` (trailing slash) | 308 → `/png-to-webp` |
| `/privacy.html`, `/terms.html` | 308 → `/privacy`, `/terms` (200) |
| `http://getcompressly.com/png-to-webp.html` | 2 hops (301 https → 308 clean) — only matters for legacy links |
| `/google5b6fe018f393a61e.html` | 308 → extensionless — GSC *file* verification may fail; the meta-tag verification in `index.html` covers it |

Minor: both the React footer and all five landing-page footers link to `/privacy.html` and `/terms.html`, so every internal legal link is a 308. Change the hrefs to `/privacy` and `/terms`. Landing pages deep-link to `/?to=webp#tool` etc.; homepage canonical is `https://getcompressly.com/` so the parameter variants collapse correctly.

#### 1.7 Not present (informational)
`llms.txt` (sibling agent), IndexNow key file (Bing/Copilot/ChatGPT-via-Bing fast indexing) — both currently resolve to the soft-404 homepage.

---

### 2. READ — what does a non-JS fetcher actually get?

#### 2.1 Homepage is 100% client-rendered — CRITICAL
Raw `GET https://getcompressly.com/` (6,047 bytes) body in full:
```html
<body class="bg-[#0b0d12] text-zinc-100 antialiased">
    <div id="root"></div>
</body>
```
Measured, raw vs rendered (Chromium, same build served locally):

| | Raw HTML (what GPTBot/ClaudeBot/PerplexityBot see) | Rendered DOM |
|---|---|---|
| Body words | **0** | 587 |
| H1 | none | "Compress images 10× smaller without losing what matters." |
| H2 | 0 | 3 ("Built for people who ship images all day", "One price. Lifetime. No subscription.", "Frequently asked") |
| Internal links | 0 | 7 |
| FAQ Q&As visible | 0 (6 exist only inside JSON-LD) | 8 |

Framework: React 18 + Vite 6 SPA, no SSR/prerender step (`vite.config.ts` has only `react()` and `tailwindcss()`), content strings live in `/assets/index-0CeCobE2.js` (347 KB raw / 108 KB br). Bundle on the live site is byte-identical to local `dist/`.

What *is* in the raw HTML and works today: `<title>`, description, canonical, robots meta, viewport, full OG + Twitter sets, and three JSON-LD blocks (`SoftwareApplication` with two `Offer`s, `WebSite`, `FAQPage` with 6 Q&As). So an AI crawler gets a rich `<head>` and an empty page — the FAQ answers are readable only as structured data, not as prose, and there is no H1, no pricing copy, no feature copy to quote.

Fix options (any of these; the landing pages prove the static approach already works on this stack):
1. Build-time prerender: `react-dom/server` `renderToString(<App/>)` into `dist/index.html` (or `vite-plugin-prerender` / `vite-ssg`-style plugin) and `hydrateRoot` on the client. Keeps the tool interactive, gives crawlers the full 587 words + links.
2. Move the marketing sections (hero, features, pricing, FAQ, footer) to static HTML in `index.html` and mount React only into a `<div id="tool">` for the compressor. Zero framework change, mirrors how `/png-to-webp` is built.
3. Minimum stop-gap: a static `<nav>`/`<footer>` with the five landing links and a one-paragraph description inside `index.html` (outside `#root`).

#### 2.2 Landing pages are fully server-rendered — Pass
| URL | Raw body words | H1 | H2s | Internal links | JSON-LD |
|---|---|---|---|---|---|
| /png-to-webp | 725 | Convert PNG to WebP | 7 | 15 | BreadcrumbList, HowTo, FAQPage |
| /jpg-to-webp | 686 | Convert JPG to WebP | 7 | 15 | same |
| /webp-to-png | 657 | Convert WebP to PNG | 7 | 16 | same |
| /webp-to-jpg | 650 | Convert WebP to JPG | 7 | 15 | same |
| /compress-webp | 681 | Compress WebP | 7 | 16 | same |

No scripts at all on these pages (one 6.5 KB `landing.css` + Google Fonts). FAQ answers are in visible `<details>` markup as well as JSON-LD. This is the model the homepage should follow.

#### 2.3 COOP / COEP — does cross-origin isolation hurt crawlers or embeds?
Headers on every response (from `public/_headers`, needed for `SharedArrayBuffer` → multi-threaded AVIF/JXL WASM, 2–4× faster):
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
- **Crawlers: no effect.** Both are browser-enforced isolation policies. curl, GPTBot, ClaudeBot, PerplexityBot, Googlebot all received 200 + full HTML in the UA test. Googlebot's renderer (headless Chromium) honours COEP, but every resource it needs passes: same-origin assets; Google Fonts CSS and woff2 (verified `cross-origin-resource-policy: cross-origin` + `ACAO: *`); Cloudflare's injected Insights beacon (verified CORP `cross-origin`). `window.crossOriginIsolated === true` confirmed in a real browser on the live site — the headers are doing their job.
- **Embeds: constrained, by design.** `require-corp` blocks any *future* cross-origin `<iframe>`, `<script>`, `<img>` that does not send CORP/CORS — e.g. the Lemon Squeezy overlay checkout (`lemon.js` iframe), YouTube embeds, third-party review widgets, hot-linked images. Today nothing is affected: checkout is a plain `<a target="_blank">` (COOP merely severs `window.opener`, harmless). Being *framed by other sites* is not restricted by these headers (that needs X-Frame-Options/CSP, which are absent — see 3.3). If embeds ever become necessary, `COEP: credentialless` is the softer alternative that keeps SAB in Chromium/Firefox.
- Keep them.

#### 2.4 Markdown content negotiation (non-scoring)
`GET / ` with `Accept: text/markdown` → `text/html`. Not supported. Forward-looking only: Cloudflare's "Markdown for Agents" could be switched on for this Pages project; it would help the five landing pages, and the homepage only after 2.1.

#### 2.5 RFC 8288 Link headers (non-scoring)
Only `Link: <https://fonts.googleapis.com>; rel=preconnect` (also sent as a `103 Early Hints` response — Cloudflare Early Hints is on, a small LCP win). Not an API-first site; no service-discovery recommendation.

---

### 3. CITED — do the trust/preview signals hold up?

#### 3.1 og:image is broken on all 6 pages — HIGH
Every page declares `og:image` / `twitter:image` = `https://getcompressly.com/og.png`; that URL returns 200 `text/html` (soft-404, 1.4). Facebook/LinkedIn/X/Slack/iMessage previews and AI answer cards that pull a thumbnail get nothing. No `og.png` exists in `public/` or `dist/`. Ship a 1200×630 image and fix 1.4 so a missing asset fails loudly next time.

#### 3.2 Meta tags audit
| Tag | Homepage | Landing pages (×5) |
|---|---|---|
| Title | Present, 74 chars — over the ~60-char SERP cut, brand first so truncation is tolerable | 60–68 chars, keyword-first, brand suffix — good |
| Description | Present, **203 chars** — will be truncated; trim to ≤160 | 150–166 chars — good |
| Canonical | Self-referencing apex | Self-referencing apex (also when served via www) |
| Meta robots | `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` | `index,follow,max-image-preview:large` |
| Viewport | `width=device-width, initial-scale=1.0` | same |
| `<html lang>` | en | en |
| Open Graph | Complete (type, site_name, locale, url, title, description, image) | Partial: missing `og:site_name`, `og:locale` (optional); image broken |
| Twitter Card | Complete | Only `twitter:card` — X falls back to OG, so works except the image |
| JSON-LD | SoftwareApplication (2 Offers), WebSite, FAQPage(6) — syntactically valid, in raw HTML | BreadcrumbList, HowTo, FAQPage(4) — valid, in raw HTML |
| hreflang | n/a (single language) | n/a |

Note for the schema agent: Google no longer shows HowTo rich results (2023) and restricts FAQ rich results to gov/health sites; the markup still helps AI extraction, so keep it, but do not expect SERP features from it.

#### 3.3 Security headers — Warn
| Header | Status | Value |
|---|---|---|
| HTTPS | Yes | Google Trust Services WE1, valid 2026-07-24 → 2026-10-22 (Cloudflare auto-renews); www has its own cert |
| HTTP → HTTPS | Yes | 301, 1 hop |
| Strict-Transport-Security | **Missing** | enable in Cloudflare → SSL/TLS → Edge Certificates → HSTS, or add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to `_headers` |
| Content-Security-Policy | **Missing** | at minimum `frame-ancestors 'none'`; a full policy is feasible — the only third-party origins are fonts.googleapis.com, fonts.gstatic.com, api.lemonsqueezy.com, static.cloudflareinsights.com (WASM needs `'wasm-unsafe-eval'`) |
| X-Frame-Options | **Missing** | `DENY` (or CSP frame-ancestors) — site is currently frameable |
| X-Content-Type-Options | Present | nosniff |
| Referrer-Policy | Present | strict-origin-when-cross-origin |
| Permissions-Policy | Present, minimal | `interest-cohort=()` only (FLoC opt-out); add `camera=(), microphone=(), geolocation=(), payment=()` |
| COOP / COEP | Present | same-origin / require-corp (see 2.3) |
| Mixed content | None | |

Deductions per rubric: HSTS −10, CSP −10, XFO −5, thin Permissions-Policy −3 → 72.

#### 3.4 Privacy statement vs. actual scripts — LOW
`/privacy` states the site "does not run any third-party analytics or tracking scripts". Cloudflare Web Analytics is enabled on the zone and injects `https://static.cloudflareinsights.com/beacon.min.js` at the edge for browser requests (verified: present with a browser `Accept` header, absent for curl). It is cookieless, but it is a third-party script; either turn the injection off or soften the wording ("cookieless, aggregate page-view counting by Cloudflare").

---

### 4. ENOUGH — once a visitor (or an agent) arrives, can they act?

#### 4.1 "Buy Pro" links to a placeholder that 404s — CRITICAL (business, not counted in the technical score)
`src/components/Pricing.tsx` falls back to `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` when `VITE_LS_CHECKOUT_URL` is unset. The repo has only `.env.example`; the live bundle (`/assets/index-0CeCobE2.js`, byte-identical to `dist/`) contains the placeholder, the rendered page's only external link is `https://your-store.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`, and that URL returns **404**. Every Pro purchase attempt since launch fails. Set `VITE_LS_CHECKOUT_URL` (Pages build env or `.env.production`), rebuild, redeploy, and click the button on the live site.

#### 4.2 Performance / Core Web Vitals risk (static analysis; validate with PSI/CrUX)
| Vital | Risk | Indicators |
|---|---|---|
| LCP | Medium-High (homepage) / Low (landing) | Homepage LCP element (hero text) cannot paint until 108 KB br JS downloads, parses and React mounts; render-blocking external Google Fonts CSS on every page; no `modulepreload`/`preload` for the entry chunk; no images anywhere (helps). |
| INP | Low-Medium | Encoding runs in a Web Worker (comlink) with WASM — main thread stays free; React 18; no third-party widgets. |
| CLS | Low-Medium | No images/iframes; `display=swap` fonts → FOUT risk on headings; content appears in one mount rather than shifting. |

Delivery is good: HTTP/2 + HTTP/3 (`alt-svc: h3`), brotli, Cloudflare CDN, 103 Early Hints, `Cache-Control: public, max-age=31536000, immutable` on hashed `/assets/*`, HTML `max-age=0, must-revalidate`, `landing.css` (unhashed) `max-age=14400`. TTFB measured through the sandbox proxy (apex 0.73–0.92 s incl. ~0.5 s proxied TLS; pages.dev 0.32–0.35 s) — not field data; Cloudflare edge should be well under 200 ms from a real client.

Asset budget: `dist/assets` = 15 MB, but codecs are dynamically imported per format inside the worker (`src/lib/worker.ts`), so first paint costs only HTML 6 KB + JS 108 KB br + CSS 6 KB br + fonts. On first use per format (brotli over the wire): MozJPEG 58 KB, PNG 82 KB, WebP-SIMD 122 KB, **JXL MT-SIMD 535 KB (2.0 MB raw), AVIF MT 1.05 MB (3.5 MB raw)**. All served `application/wasm` with `Cross-Origin-Resource-Policy: cross-origin` and 1-year immutable caching. One gap: `.wasm` responses show `cf-cache-status: DYNAMIC` while `.js`/`.css` show `HIT` — `.wasm` is not in Cloudflare's default cacheable-extension list, so a Cache Rule ("Eligible for cache" on `/assets/*.wasm`) would make the 1 MB AVIF download hit the edge instead of origin.

Quick wins: `<link rel="modulepreload" href="/assets/index-*.js">` (Vite emits it if `build.modulePreload` is on and the entry is not inline); self-host Inter/JetBrains Mono (removes a cross-origin render-blocking CSS request and the preconnects); consider `fetchpriority` hints once there is a hero image.

#### 4.3 Mobile — Pass
Viewport correct on all pages; Tailwind v4 responsive utilities (`@media (min-width: 40/48/64rem)`, `flex-col sm:flex-row`, `hidden sm:inline`); `landing.css` has `@media (max-width: 560px)` and a 17 px base; CTA buttons `px-5 py-3` (≥44 px tall); no images; identical content on mobile and desktop. Not measured in device emulation.

---

## Priority Actions

1. **[CRITICAL — READ]** Prerender the homepage (build-time `renderToString` + `hydrateRoot`, or move marketing sections to static HTML and mount React only into `#tool`). Evidence: raw body 0 words / 0 links / no H1 vs. 587 words / 7 links rendered. Until then, add a static nav + one descriptive paragraph inside `index.html` outside `#root`.
2. **[CRITICAL — ENOUGH, outside SEO score]** Set `VITE_LS_CHECKOUT_URL`, rebuild, redeploy; live Buy Pro → `your-store.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` → 404.
3. **[HIGH — FOUND/CITED]** Add `public/404.html` to end SPA-fallback soft-404s, then ship `og.png` (1200×630), `favicon.ico`, `apple-touch-icon.png`. Evidence: all three plus any random path return 200 `text/html` 6,047 bytes on apex and pages.dev.
4. **[HIGH — FOUND]** `_redirects`: `https://www.getcompressly.com/* https://getcompressly.com/:splat 301`. Evidence: www serves 200 on every URL with its own cert.
5. **[HIGH — CITED]** Enable HSTS; add `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`); add a CSP; widen Permissions-Policy.
6. **[MEDIUM]** Fix internal `/privacy.html` `/terms.html` hrefs → `/privacy` `/terms` (footer in React + 5 landing pages); trim homepage description to ≤160 chars; refresh sitemap `lastmod`; Cache Rule for `/assets/*.wasm`; `modulepreload` for the entry chunk.
7. **[LOW]** Add `twitter:title/description/image` on landing pages (or accept OG fallback once og.png exists); IndexNow key + ping; Markdown content negotiation on Cloudflare; reconcile privacy wording with the injected Cloudflare Insights beacon; self-host fonts.

## Evidence index
- Raw fetches: `curl -sL --retry 3 --retry-all-errors -m 30` on apex; headers captured for `/`, 5 landing pages, robots.txt, sitemap.xml, assets, WASM.
- Rendered contrast: live site in Chromium (`crossOriginIsolated: true`, sandbox blocked `/assets/*` client-side) and the identical `dist/` build served locally (587 words, links, H1/H2 list).
- Bot access: UA spoof for GPTBot, ClaudeBot, Googlebot, PerplexityBot, CCBot → 200 each.
- Source (read-only): `public/_headers`, `vite.config.ts`, `wrangler.toml`, `src/components/{Footer,Header,Hero,FAQ,Pricing}.tsx`, `src/lib/worker.ts`, `src/App.tsx`; no files modified.
