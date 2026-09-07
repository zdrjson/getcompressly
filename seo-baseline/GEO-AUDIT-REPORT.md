# GEO Audit Report: Compressly

**Audit Date:** 2026-07-24 (BASELINE — before any fixes)
**URL:** https://getcompressly.com
**Business Type:** SaaS (browser-based image compression tool, free tier + $39 one-time Pro)
**Pages Analyzed:** 6 sitemap URLs (/ + 5 landing pages) + privacy/terms + asset/soft-404 probes
**Method:** geo-seo-claude v2026-02 — 5 parallel subagents (AI visibility, technical, content, schema, platform). Per-agent reports are in this folder.

---

## Executive Summary

**Overall GEO Score: 34/100 (Critical)**

Compressly is fully reachable — every AI and search crawler tested gets HTTP 200 with no blocking — but almost nothing after the "found" stage works. The homepage, the main conversion page, is a React SPA whose served HTML body is literally `<div id="root"></div>`: 0 words, no H1, and no links to the five landing pages. Non-JS AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) therefore see only the `<head>`. The five static landing pages are technically sound but carry FAQ/HowTo schema whose text does not match the visible page, contain two factual errors on the homepage FAQ, cite no evidence, and have zero brand presence anywhere on the web (Brand Authority 2/100). Bing has indexed nothing, which blacks out ChatGPT search and Copilot. Separately, the live "Get Pro — $39" button points at a build placeholder and cannot be purchased.

The good news: the two highest-impact fixes are pure code (pre-render the homepage; sync schema text to visible text) and the next tier (404.html, llms.txt, www redirect, security headers, Organization schema) are each one file or one line.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 42/100 | 25% | 10.5 |
| Brand Authority | 2/100 | 20% | 0.4 |
| Content E-E-A-T | 37/100 | 20% | 7.4 |
| Technical GEO | 63/100 | 15% | 9.45 |
| Schema & Structured Data | 28/100 | 10% | 2.8 |
| Platform Optimization | 30/100 | 10% | 3.0 |
| **Overall GEO Score** | | | **34/100** |

Sub-scores worth tracking: AI crawler access 100/100 · llms.txt 0/100 · E-E-A-T (Experience 7 / Expertise 8 / Authoritativeness 3 / Trustworthiness 10) · Platforms: Google AIO 42 · Bing Copilot 32 · ChatGPT 30 · Perplexity 25 · Gemini 21.

---

## Critical Issues (Fix Immediately)

Ordered by the crawl funnel: found → read → cited → enough.

**C1. [READ] Homepage is 100% client-rendered — invisible to non-JS AI crawlers.**
`https://getcompressly.com/` served HTML body = `<div id="root"></div>`. Raw: 0 words, 0 links, no H1. Same build rendered in Chromium: ~587 words, H1, 3 H2, 7 internal links. Tool checks: `has_ssr_content: False`, citability blocks = 0. The six best-written passages on the site (e.g. the pricing FAQ answer, 79/100 citability) exist only inside FAQPage JSON-LD, which text extractors strip. `FAQ.tsx` renders answers conditionally, so 7 of 8 FAQ answers are never in the DOM even for Googlebot. Links to the 5 landing pages exist only in `Footer.tsx` — AI crawlers cannot discover them from the homepage.
**Fix:** pre-render the marketing sections (hero/H1, value prop, feature list, pricing, full FAQ, nav to the 5 landing pages) as static HTML inside `#root` in `index.html` (React replaces it on mount), or add a build-time prerender. Switch FAQ to always-in-DOM markup (`<details>`/H3). Estimated lift: site citability 42 → ~52.

**C2. [CITED] Factual errors in homepage FAQ schema (and visible FAQ).**
"Compressly uses Google's MozJPEG…" — MozJPEG is a Mozilla project, not Google's. "TinyPNG only supports JPG/PNG/WebP" — TinyPNG supports AVIF. Related overreach: landing pages say browsers "use" MozJPEG/OxiPNG (they are encoders, not what browsers ship); "JXL … better compression than AVIF" stated as fact (contested). These violate the no-fabrication standard and erode AI trust.
**Fix:** correct the encoder attributions (MozJPEG → Mozilla; libwebp/libavif → Google/AOMedia; libjxl → JPEG XL project), fix the TinyPNG claim, hedge the JXL/AVIF comparison.

**C3. [CITED] FAQPage / HowTo JSON-LD text ≠ visible text on all 5 landing pages.**
Measured: 0/20 FAQ answers and 3/20 questions appear on-page verbatim; all 15 HowTo steps differ from the visible `<ol class="steps">`. Google's structured-data policy requires schema to reflect visible content; mismatches risk manual action and reduce AI trust.
**Fix:** copy-sync — make the JSON-LD `name`/`text` strings exactly equal the visible `<summary>`/`<p>` and step text on each page.

**C4. [FOUND] Zero Bing index; no Bing Webmaster Tools; no IndexNow.**
Bing `site:getcompressly.com` → no results; DuckDuckGo 0. ChatGPT search and Microsoft Copilot are Bing-backed, so two of five AI platforms are completely dark.
**Fix (user action):** Bing Webmaster Tools → import from Google Search Console → submit sitemap; add a static IndexNow key file to `public/`.

**C5. [ENOUGH — outside GEO scoring, blocks conversion] "Get Pro — $39" is dead.**
Live bundle (byte-identical to local `dist/`) ships `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` → 404. `VITE_LS_CHECKOUT_URL` was unset at build. The $39 Offer in SoftwareApplication schema advertises something that cannot be bought. Any AI-referred buyer hits a dead link.
**Fix:** set `VITE_LS_CHECKOUT_URL` once the Lemon Squeezy product exists, rebuild, redeploy. (In progress — LS account being created.)

---

## High Priority Issues

**H1. [FOUND] Soft-404 everywhere — no `404.html`.**
Cloudflare Pages SPA fallback returns **HTTP 200 + homepage HTML** for `/og.png`, `/favicon.ico`, `/apple-touch-icon.png`, `/llms.txt`, `/ai.txt`, `/about`, `/BingSiteAuth.xml`, `/.well-known/indexnow-key.txt` and any random path. Social/AI previews receive HTML instead of an image; unbounded crawlable URL space; masks real 404s ("green lights that lie"). Safe to fix: no client-side routing exists.
**Fix:** add `public/404.html`; ship the missing image assets.

**H2. [FOUND] No `llms.txt`.**
Absent (and soft-404s to the SPA shell). A validated draft is in `geo-ai-visibility.md` (founder/location left as `[FILL]` — do not invent).
**Fix:** add `public/llms.txt` from the draft.

**H3. [FOUND] `www.getcompressly.com` is a live duplicate host.**
Serves 200 on every URL with its own cert and never redirects to the apex; canonical tags mitigate but do not consolidate.
**Fix:** one `_redirects` line: `https://www.getcompressly.com/* https://getcompressly.com/:splat 301`.

**H4. [CITED] Brand entity collision + zero mentions (Brand Authority 2/100).**
"Compressly" already resolves to compressly.net / .in / .co, a GitHub repo, three unrelated App Store apps and `youtube.com/@compressly` (a music channel); "getcompressly" collides with GetCompress (Product Hunt). Wikipedia/Wikidata/LinkedIn/HN/X: absent. Site ships no `Organization` schema and no `sameAs`; `/about` soft-404s. Ahrefs DR 0; domain registered today. LLMs are likely to attribute the wrong product.
**Fix:** `Organization` + `@id` graph + `sameAs` pointing at owned profiles (create them: GitHub org/repo, X, Product Hunt, LinkedIn); a real `/about` page; consistent entity naming ("Compressly (getcompressly.com)").

**H5. [CITED] Minimal / missing schema.**
No `Organization`, no `@id` graph, zero `sameAs`; `SoftwareApplication` lacks `featureList`, `isAccessibleForFree`, `softwareVersion`, `browserRequirements`, `applicationSubCategory`, named Offers with `availability`/`url`; no `image`/`logo` possible until assets exist. Do **not** add `aggregateRating`/`review` until third-party-verifiable reviews exist. `SearchAction` N/A (no site search). Two validated `@graph` templates are in `geo-schema.md`.

**H6. [CITED / ENOUGH] Landing pages have the right skeleton but no evidence.**
609–737 words each, HowTo + FAQ + Breadcrumb, comparison table, best passage 65/100 — but: no direct-answer/definition sentence under the H1, FAQ answers 14–28 words (too short to cite), FAQ in `<details>` not H3, 0 images, 0 screenshots, 0 outbound citations, no first-party benchmark data, no author, no dates; the "25–35% smaller" / "20–30%" figures are unsourced. Identical 8-section template cloned 5×.
**Fix:** per page add a 40–60-word definition/answer block under H1, a first-party benchmark table (real files, real sizes), 1–2 screenshots, sourced statistics, visible author + updated date; expand FAQ answers to 40–80 words.

**H7. [TECHNICAL] Missing security headers.**
No HSTS, no CSP, no X-Frame-Options (site is frameable); Permissions-Policy is FLoC-only. Present and correct: nosniff, Referrer-Policy, COOP/COEP.
**Fix:** add to `public/_headers`: `Strict-Transport-Security`, a CSP, `X-Frame-Options: DENY`.

**H8. [CITED] Missing image assets referenced by every page.**
`og.png`, `apple-touch-icon.png`, `favicon.ico`, logo — all referenced, none exist (soft-404 to HTML). Social shares and AI previews break; schema cannot carry `image`/`logo`.
**Fix:** create and ship the assets.

---

## Medium Priority Issues

**M1. [ENOUGH] Content breadth.** Only a WebP cluster exists while the tool handles AVIF/JXL/PNG/JPG. Topical-authority path: `/compress-png`, `/compress-jpg`, `/avif-converter` (png/jpg→avif), `/heic-to-jpg`, `/jxl` explainer, plus a benchmark/comparison page.

**M2. [TRUST] Privacy page contradicts reality.** It now states "no third-party analytics", but Cloudflare edge-injects a Web Analytics beacon on every page.
**Fix:** state accurately: "Cloudflare Web Analytics (cookieless, no personal data)".

**M3. Homepage meta description is 203 characters** (truncates ~155–160).

**M4. No dates anywhere; sitemap `lastmod` stuck at 2026-07-24.** Add visible "Updated" dates and keep `lastmod` real.

**M5. `.wasm` bundles not edge-cached** (`cf-cache-status: DYNAMIC`; AVIF encoder ~1.05 MB br). Add a `Cache-Control` rule for `/assets/*.wasm` (they are content-hashed).

**M6. Internal links to `/privacy.html` / `/terms.html` hit a 308** to the clean URL on every click. Link to `/privacy` and `/terms` directly.

**M7. Contact email is Cloudflare-obfuscated** on privacy/terms (CF "Email Address Obfuscation"), hiding it from crawlers/AI. Either disable that feature or render the address as plain text.

**M8. Minor copy accuracy.** Footer typo "Compresses image" → "images"; "browsers use MozJPEG/OxiPNG" overreach; JXL-vs-AVIF stated as fact.

**M9. Homepage FAQ coverage gap.** 2 of 8 visible FAQs are absent from the FAQPage schema (and vice-versa once pre-rendered — keep them in sync).

---

## Low Priority Issues

- **L1.** No `Content-Signal` header (emerging AI-usage signal).
- **L2.** `Permissions-Policy` only covers FLoC; extend to camera/microphone/geolocation.
- **L3.** COOP/COEP are correct and should be **kept** (no crawler impact; `crossOriginIsolated: true`). Note: they will block a future cross-origin iframe/overlay (e.g. a Lemon Squeezy embedded checkout) — the current plain-link checkout is unaffected.
- **L4.** Reddit / Product Hunt could not be verified (403 / MCP down) — brand checks there are unconfirmed, not negative.

---

## Category Deep Dives

### AI Citability (42/100)
Crawler access is perfect (100) but content extraction is poor. Homepage: 0 extractable blocks. Landing pages: best block 65/100, average 38–53; zero passages in the ideal 134–167-word citation band; no definition sentence under any H1; unsourced statistics; JSON-LD FAQ text differs from visible `<details>` on all 5 pages. The highest-scoring passages on the site are trapped in JSON-LD only. See `geo-ai-visibility.md`.

### Brand Authority (2/100)
No mentions on Wikipedia, Wikidata, LinkedIn, HN, X, YouTube (the handle belongs to a music channel). Name collides with at least six unrelated "Compressly" products and "GetCompress". No Organization/sameAs to disambiguate. DR 0, domain registered today. This category can only move through off-site work (owned profiles, launches, mentions) plus on-site entity markup. See `geo-ai-visibility.md`, `geo-platform-analysis.md`.

### Content E-E-A-T (37/100)
Prose quality is genuinely good (Flesch 63–76, zero generic-phrase hits, honest trade-offs). E-E-A-T 28/100: no author, no About, no evidence, no citations, no dates. Word counts are 0.70–0.95× the top-10 median — **length is not the lever**: CloudConvert ranks #1 on 4/5 target keywords with ~140 words at DR 82; top-10 DRs are 62–96. What cited pages have that Compressly lacks: answer-shaped sections (AI Overviews are live on 3/5 queries), original numbers, screenshots, identity. Target 1,200–1,500 words/page built from PAA answers + a benchmark block — not filler. See `geo-content.md`.

### Technical GEO (63/100)
Landing pages: static, self-canonical, JSON-LD in raw HTML, 15–16 internal links each — sound. Drags: homepage CSR (C1), soft-404 fallback (H1), www duplicate (H3), missing security headers (H7), uncached WASM (M5), 308 on legal links (M6). All bot UAs receive full HTML; COOP/COEP have no crawler effect. See `geo-technical.md`.

### Schema & Structured Data (28/100)
18/18 JSON-LD blocks parse and validate against schema.org; all in static `<head>` (visible to non-JS crawlers); URLs consistently apex; BreadcrumbList rich-result eligible on all 5 landing pages; fabricated rating correctly removed. Failures: FAQ/HowTo text ≠ visible (C3), no Organization/@graph/sameAs (H5), SoftwareApplication minimal, no image/logo possible (H8), $39 Offer unpurchasable (C5). Two validated `@graph` templates provided. See `geo-schema.md`.

### Platform Optimization (30/100)
Google AIO 42 (can render JS; needs answer blocks + entity) · Bing Copilot 32 and ChatGPT 30 (Bing index = 0 → dark) · Perplexity 25 (non-JS; sees empty homepage; wants fresh, citable lists/tables) · Gemini 21. All 13 crawler UAs → 200. See `geo-platform-analysis.md`.

---

## Correction to the Source Article's Thesis

The article this audit follows concluded "the remaining gap is word count (550 vs 1,500–3,000)". For Compressly that is **not** the binding constraint: competitors rank with far fewer words on far higher domain authority. Fix order here is (1) render → (2) schema/facts → (3) evidence + entity → (4) breadth. Adding words without evidence would not move the score.

---

## Quick Wins (Implement This Week — all code-only unless noted)

1. **Pre-render the homepage** (static hero/H1, features, pricing, full FAQ, nav to the 5 landing pages inside `#root`; FAQ always in DOM). Fixes C1; biggest single lift.
2. **Sync FAQ/HowTo JSON-LD text to the visible text** on all 5 landing pages. Fixes C3.
3. **Correct the factual errors** (MozJPEG attribution, TinyPNG/AVIF, browser-encoder overreach, JXL/AVIF hedge, footer typo). Fixes C2, M8.
4. **Add `public/404.html`** + create `og.png`, `favicon.ico`, `apple-touch-icon.png`. Fixes H1, H8.
5. **Add `public/llms.txt`** from the validated draft. Fixes H2.
6. **`_redirects`: www → apex 301.** Fixes H3.
7. **`_headers`: HSTS, CSP, X-Frame-Options; cache `/assets/*.wasm`.** Fixes H7, M5.
8. **Organization + `@graph` schema; enrich SoftwareApplication** (no ratings). Fixes H5.
9. **Fix privacy text** to name Cloudflare Web Analytics accurately. Fixes M2.
10. **Bing Webmaster Tools import + sitemap + IndexNow key** (user action). Fixes C4.

## 30-Day Action Plan

### Week 1: Render & Truth
- [ ] Pre-render homepage content + landing-page nav into static HTML (C1)
- [ ] Sync all FAQ/HowTo schema to visible text (C3)
- [ ] Fix factual errors and copy overreach (C2, M8)
- [ ] 404.html, og.png, favicon, apple-touch-icon (H1, H8)
- [ ] llms.txt, www→apex redirect, security headers, wasm caching (H2, H3, H7, M5)
- [ ] Privacy page accuracy (M2); shorten meta description (M3)
- [ ] Wire `VITE_LS_CHECKOUT_URL` once Lemon Squeezy product exists (C5)
- [ ] Re-audit → first before/after comparison

### Week 2: Entity & Indexing
- [ ] Organization/@graph/sameAs schema; enrich SoftwareApplication (H5)
- [ ] Create owned profiles to point `sameAs` at (GitHub, X, Product Hunt, LinkedIn) (H4)
- [ ] Real `/about` page with operator identity (H4, E-E-A-T)
- [ ] Bing WMT + IndexNow; request indexing of all 6 URLs in GSC (C4)
- [ ] Visible "Updated" dates; real sitemap lastmod (M4)

### Week 3: Evidence
- [ ] First-party benchmark: compress a fixed set of real images, publish sizes/percentages per format — one table reused across pages (H6)
- [ ] Screenshots of the tool per landing page (H6)
- [ ] Definition/answer block under every H1; expand FAQ answers to 40–80 words; source every statistic (H6)
- [ ] Author byline + About link on every landing page (E-E-A-T)

### Week 4: Breadth & Compare
- [ ] New pages: `/compress-png`, `/compress-jpg`, `/png-to-avif`, `/jpg-to-avif`, `/heic-to-jpg` (M1)
- [ ] Benchmark/comparison page (Compressly vs TinyPNG vs Squoosh — verified facts only)
- [ ] Launch on Product Hunt / Show HN for first mentions (H4)
- [ ] Re-audit and run `/geo compare` against this baseline

---

## Appendix: Pages Analyzed

| URL | Title | GEO Issues |
|---|---|---|
| / | Compressly — Free Online Image Compressor… | C1, C2, C5, H5, H8, M3, M9 |
| /png-to-webp | Convert PNG to WebP — Free, Private, In Your Browser | C3, H6, M8 |
| /jpg-to-webp | Convert JPG to WebP — Free Batch Converter, No Upload | C3, H6 |
| /webp-to-png | Convert WebP to PNG — Free, Lossless, No Upload | C3, H6 |
| /webp-to-jpg | Convert WebP to JPG — Free, No Upload, Universal | C3, H6 |
| /compress-webp | Compress WebP — Make WebP Files Smaller, Free & Private | C3, H6 |
| /privacy.html, /terms.html | Legal | M2, M6, M7 |
| /og.png, /llms.txt, /about, /favicon.ico … | (soft-404 → 200 HTML) | H1 |

**Fetch notes:** the sandbox proxy intermittently returns HTTP 000 for the apex; agents used `--retry` and the byte-identical `compressly-3wn.pages.dev` deployment where needed. The sandboxed browser blocked the site's own `/assets/*.js`, so JS-rendered homepage word counts are estimated from source (≈587–650), not measured live. Reddit/Product Hunt returned 403 — brand presence there is unverified, not negative.
