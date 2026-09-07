# AI Visibility Analysis — getcompressly.com

**Target:** https://getcompressly.com (canonical apex; `compressly-3wn.pages.dev` and `www.` serve the identical deployment)
**Audit date:** 2026-09-04 (CST)
**Method:** `geo-ai-visibility` agent methodology (citability → crawler access → llms.txt → brand mentions). Live fetches with `curl --retry 3` and the `~/.claude/skills/geo` venv scripts (`citability_scorer.py`, `brand_scanner.py`). Analysis only — nothing on the site or in `src/`/`public/` was modified.

---

## AI Visibility Score: 40/100 — Poor

| Component | Score | Weight | Weighted |
|---|---|---|---|
| Citability | 42/100 | 35% | 14.7 |
| Brand Mentions | 0/100 | 30% | 0.0 |
| Crawler Access | 100/100 | 25% | 25.0 |
| llms.txt | 0/100 | 10% | 0.0 |
| **AI Visibility (composite)** | | | **39.7 → 40** |

**Brand Authority sub-score (geo-brand-mentions formula): 2/100 — Minimal**
(YouTube 3 · Reddit 3 · Wikipedia 0 · LinkedIn 0 · Other 3, weighted 25/25/20/15/15)

Interpretation: robots-level access is perfect, but the site's most important page is invisible to non-JS AI crawlers, there is no llms.txt (and every missing file soft-404s), and the brand has zero off-site footprint while sharing its name with three unrelated App Store apps and a YouTube music channel. The 40 is almost entirely the crawler-access component; every stage after "found" is weak.

---

## Funnel view

| Stage | Question | Verdict |
|---|---|---|
| **Found** | Can AI crawlers discover and fetch the pages? | Yes — robots/sitemap/no UA blocks. But: no llms.txt, soft-404 on every unknown path, duplicate hosts, brand-name collisions, zero off-site mentions. |
| **Read** | Do they get text worth reading? | Landing pages yes (661–737 words). **Homepage no: 13 visible words**, all copy is client-rendered; 7 of 8 FAQ answers are never in the DOM even after JS. |
| **Cited** | Are the passages quotable? | Moderate. Best block 65/100; site average 42; **zero passages in the 134–167-word optimal band**; no sourced statistics; no first-party data. |
| **Enough** | If cited and clicked, does it convert? | **No — the production "Get Pro — $39" button links to `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`.** No linkable pricing/FAQ/about URLs exist. |

---

## 1. FOUND — Discovery and access

### 1.1 AI crawler access (robots.txt) — Score 100/100

Live `robots.txt` (227 bytes):

```
User-agent: *
Allow: /
User-agent: GPTBot / ClaudeBot / PerplexityBot → Allow: /
Sitemap: https://getcompressly.com/sitemap.xml
```

| Crawler | Status | Notes |
|---|---|---|
| GPTBot | Allowed (explicit) | |
| OAI-SearchBot | Allowed (inherits `*`) | Not named — powers ChatGPT Search; name it explicitly |
| ChatGPT-User | Allowed (inherits `*`) | Not named |
| ClaudeBot | Allowed (explicit) | |
| PerplexityBot | Allowed (explicit) | |
| Google-Extended | Allowed (inherits `*`) | Not named |
| Applebot-Extended | Allowed (inherits `*`) | Not named |
| Amazonbot / FacebookBot / GoogleOther | Allowed (inherits `*`) | Not named |
| CCBot / anthropic-ai / cohere-ai / Bytespider | Allowed (inherits `*`) | No training-bot policy declared |

- No `Crawl-delay`. Sitemap referenced. No `Disallow` anywhere.
- **UA-level test:** fetched `/` and `/png-to-webp` as GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot → all HTTP 200, identical byte sizes to a browser UA. No Cloudflare bot challenge, no `cf-mitigated` header.
- **Meta robots:** homepage `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`; landing pages `index,follow,max-image-preview:large`. No `noai`/`noimageai`.
- **HTTP headers:** no `X-Robots-Tag` on any page. `Cross-Origin-Embedder-Policy: require-corp` + `COOP: same-origin` are set site-wide (needed for multi-threaded WASM) — they do not affect crawlers but will block any future third-party embed/widget that lacks CORP headers.
- **Content-Signal:** Absent. Recommendation: add `Content-Signal: search=yes, ai-retrieval=yes, ai-train=yes` (set `ai-train=no` only if you want to opt out of training; it does not affect search/retrieval). See https://contentsignals.org/.

Deductions per the agent formula: none → **100**. (The `geo-crawlers` skill's alternative rubric gives 95: −5 for the missing llms.txt.)

### 1.2 Sitemap

`sitemap.xml` lists exactly 6 URLs (`/` + 5 landing pages), all `lastmod 2026-07-24`. `privacy.html` and `terms.html` are live (200) but not listed — fine. Every `lastmod` is the same date as the domain registration, so nothing signals freshness; update `lastmod` on the homepage when content changes.

### 1.3 Soft-404 on every unknown path (found → read leakage)

Because Cloudflare Pages is in SPA-fallback mode (no `public/404.html`), **every non-existent path returns HTTP 200 with the 6,047-byte homepage HTML**:

| Path | Expected | Actual |
|---|---|---|
| `/llms.txt` | 404 or text/plain | **200 text/html** (byte-identical to `/`) |
| `/llms-full.txt`, `/ai.txt`, `/.well-known/ai-plugin.json` | 404 | 200 text/html |
| `/og.png` (referenced by every page's `og:image` / `twitter:image`) | image/png | **200 text/html** — file is not in `public/` |
| `/apple-touch-icon.png` (referenced in `index.html`) | image/png | 200 text/html — not in `public/` |
| `/this-page-does-not-exist` | 404 | 200 text/html |

Impact: AI crawlers probing for `llms.txt` receive HTML and may parse it as a malformed manifest; OG-image fetchers (ChatGPT/Perplexity link cards, social) get HTML instead of an image; index bloat (Bing already estimates "about 440 results" for a 8-page site). Fix is safe: the app has **no client-side routing** (no react-router in `package.json`; landing-page deep links use only `/?to=webp#tool`), so adding `public/404.html` disables the SPA fallback without breaking anything.

### 1.4 Duplicate hosts

| Host | `/` | `/png-to-webp` | Canonical | Notes |
|---|---|---|---|---|
| `https://getcompressly.com` | 200 | 200 | self | Primary |
| `http://getcompressly.com` | 301 → https | 301 | — | Good |
| `https://www.getcompressly.com` | **200 (no redirect)** | 200 | → apex | Mitigated by canonical only; should 301 to apex |
| `https://compressly-3wn.pages.dev` | 200 | 200 | → apex | Crawlable, `robots.txt` allows all; mitigated by canonical only |

Add a Cloudflare Redirect Rule: `www.getcompressly.com/*` → `https://getcompressly.com/$1` (301). For `*.pages.dev`, either a Bulk Redirect or accept the canonical (Pages `_headers` cannot target by host).

### 1.5 Brand entity — collisions and zero mentions

**Brand Mention Score: 0/100.** Domain registered **2026-07-24** (RDAP) — six weeks old; public launch today.

| Platform | Status | Evidence |
|---|---|---|
| Wikipedia | Absent | API search: top results "Compressed air", "Compress (software)"…; `/wiki/Compressly` → 404 |
| Wikidata | Absent | `wbsearchentities` → none |
| YouTube | Absent — **handle taken** | `youtube.com/@compressly` = "Elvis Compressly" (unrelated Russian-language music channel). Search `"compressly"`: 16 results, only 1 title contains the word (that channel). |
| Reddit | Absent (unverified) | `reddit.com/search.json` and `r/compressly` → HTTP 403 (bot block). No thread surfaced via HN/Bing. Treated as absent given domain age. |
| LinkedIn | Absent | `linkedin.com/company/compressly` → 404 |
| Hacker News | Absent | Algolia API: 0 hits for `"compressly"` and `getcompressly.com` |
| Product Hunt | Unverified | `/products/compressly` → 403 (bot block) |
| X | Absent | `x.com/compressly` → 404 |
| GitHub / npm / PyPI | Absent | GitHub search returns only unrelated "compress*" repos; npm and PyPI `compressly` → 404 (name is free) |
| **App Store (collision)** | **3 unrelated apps named "Compressly"** | "Compressly: Image Size Pro" (Leyton Nguyen), "Compressly – Streamline" (huang li), "Compressly" (TRAN VAN MANH) — all image-compression apps |
| Bing index | Own domain indexed | `site:getcompressly.com` returns results; `"compressly" -site:getcompressly.com` shows ~50 results (URLs not extractable; expected to be the iOS apps/YouTube channel) |
| Google index | Not testable from sandbox | — |

Why this matters more than the zero: when an AI model is asked "what is Compressly?", the strongest existing signals for the token "Compressly" are three iOS apps and a music channel. Without entity anchors (Organization schema with `sameAs`, consistent "Compressly (getcompressly.com)" naming, a Wikidata item, claimed handles), AI answers will conflate or mis-attribute. The site currently ships `SoftwareApplication` + `WebSite` schema with **no `sameAs`, no `Organization`/`publisher`, no `author`, no `datePublished`**.

---

## 2. READ — What crawlers actually receive

### 2.1 Homepage `/` — 13 visible words (CRITICAL)

Served HTML is a Vite/React shell: `<div id="root"></div>` with **zero body text**. Stripping `<script>`/`<style>`, the only visible words are the `<title>`. `citability_scorer.py` → `total_blocks_analyzed: 0`.

What is in the HTML that a crawler *could* use:
- `<title>`, meta description (good, includes "$39 one-time"), OG/Twitter tags (image broken — see 1.3), canonical.
- Three JSON-LD blocks: `SoftwareApplication` (with Free $0 / Pro $39 offers), `WebSite`, and **`FAQPage` with 6 Q&As** — the 6 answers are the best-written passages on the entire site (see 3.1) but they live inside `<script type="application/ld+json">`, which most text-extraction pipelines (readability/trafilatura-style extractors, Common Crawl WET, Jina-reader-type fetchers) discard. GPTBot/ClaudeBot/PerplexityBot do limited or no JS rendering.

What a JS-rendering crawler (Googlebot → AI Overviews/Gemini) would get — estimated from `src/components/*` (a live render could not be measured: the sandboxed browser pane blocked the site's own `/assets/*.js` and `.css` with `ERR_BLOCKED_BY_CLIENT`, a sandbox limitation, not a site fault):
- Hero (~75 words), Features (6 cards, ~190 words), Pricing (~105 words), Footer (~60), tool UI labels (~100) ≈ **600–650 words**.
- **FAQ: only 1 of 8 answers is ever in the DOM.** `FAQ.tsx` renders answers conditionally (`{open === i && (...)}`, default `open = 0`), so the other 7 answers do not exist in the rendered HTML until a user clicks. Even Googlebot will not read them. The landing pages, by contrast, use `<details>` (content is in the DOM) — the homepage should do the same.
- The homepage FAQ has 8 Q&As in React but only 6 in the JSON-LD (missing: cross-device license, 14-day refund policy — both citation-worthy facts).

### 2.2 Five static landing pages — good

| URL | Visible words | Structure | JSON-LD |
|---|---|---|---|
| `/png-to-webp` | 737 | H1 + 7 H2, `<ol>` steps, comparison `<table>`, `<details>` FAQ ×4, callout | BreadcrumbList, HowTo, FAQPage |
| `/jpg-to-webp` | 698 | same | same |
| `/webp-to-png` | 668 | same | same |
| `/webp-to-jpg` | 661 | same | same |
| `/compress-webp` | 693 | same | same |

All: unique `<title>`/meta description, self-canonical, `index,follow`, internal links to each other and to `/?to=<fmt>#tool`. This is the right pattern — the homepage should be built the same way.

Minor consistency issue: on all 5 pages the `FAQPage` JSON-LD questions differ in wording (and partly in content) from the visible `<details>` questions (e.g. JSON-LD "How much smaller is WebP than PNG?" vs visible "How much smaller will my files be?"; JSON-LD "Are my images uploaded to a server?" has no visible counterpart on `/png-to-webp`). Google's FAQ guidance requires the marked-up Q&A to be visible on the page; align them 1:1.

---

## 3. CITED — Citability scoring

**Citability Score: 42/100** = mean of per-page scores (each page = average of its top-5 blocks, per the agent method).

| Page | Blocks | Top-5 avg | Page avg (all blocks) | Best block | Passages in 134–167-word band |
|---|---|---|---|---|---|
| `/` (visible) | 0 | **10** ¹ | 0 | — | 0 |
| `/png-to-webp` | 6 | **55** | 52.5 | "Why move PNG to WebP" 65 | 0 |
| `/jpg-to-webp` | 6 | **53** | 50.3 | "Why convert JPG to WebP" 65 | 0 |
| `/webp-to-png` | 6 | **48** | 42.7 | "WebP vs PNG" 53 | 0 |
| `/webp-to-jpg` | 6 | **41** | 37.8 | "Why convert WebP to JPG" 59 | 0 |
| `/compress-webp` | 6 | **44** | 39.2 | "Why compress a WebP…" 59 | 0 |

¹ Visible content scores 0. Small credit given because the JSON-LD FAQ answers (below) are parseable by structured-data-aware pipelines. If the same 6 answers were visible body text, the homepage would score ~68 and lift the site score to ~52.

### 3.1 Citation-ready passages (none ≥70 in visible text; closest candidates)

1. **Homepage JSON-LD FAQ "Is Compressly really free?" — 79/100 (hidden in `<script>`)** — "Yes. The free tier handles up to 20 images per batch at 25MB each… Pro ($39 one-time, lifetime) removes the batch limit, raises the size cap to 200MB, unlocks JXL encoding, lossless mode and EXIF preservation." Direct answer, 4 numeric facts, first-party. This is the single most quotable sentence on the site and no non-JS crawler can see it.
2. **Homepage JSON-LD FAQ "How does Compressly compress images?" — 68** — names five encoders + WebAssembly + local-only. Hidden.
3. **Homepage JSON-LD FAQ "What is JXL…" — 68** — a true definition pattern ("JPEG XL (JXL) is a next-generation image format…"). Hidden.
4. `/png-to-webp` "Why move PNG to WebP" — **65** — 168 words (just above the optimal band), two concrete ranges (20–30%, 60–80%), self-contained.
5. `/jpg-to-webp` "Why convert JPG to WebP" — **65** — 178 words, "25–35%" claim, honest caveat paragraph.

### 3.2 Citation-unlikely blocks (rewrite priority)

| Block | Score | Primary weakness |
|---|---|---|
| `/compress-webp` H1/hero "Compress WebP" | 15 | 24 words, question-form hook, no definition, no fact |
| `/webp-to-png` H1/hero | 18 | 24 words, no "X is…" sentence |
| `/webp-to-jpg` H1/hero | 20 | same |
| `/webp-to-jpg` "WebP vs JPG" table | 25 | table cells are qualitative ("Smaller", "Slightly larger") — no numbers |
| `/compress-webp` "Questions" | 27 | answers start with imperatives ("Re-encode it…") and pronouns; not self-contained |
| `/compress-webp` / `/webp-to-jpg` "…in three steps" | 29–30 | UI instructions, not knowledge; zero statistics |

Systemic patterns across all pages:
- **No definition sentence under any H1.** Every hero opens with a benefit ("Shrink PNG files by 25–80%…") instead of "PNG-to-WebP conversion is…". Definition patterns roughly double citation rates.
- **Statistical density is low** (0–6/15 on every block). The only numbers are the size-reduction ranges, and none are sourced. Cite Google's WebP developer documentation for the canonical figures (lossless WebP ≈26% smaller than PNG; lossy WebP 25–34% smaller than JPEG at equivalent SSIM) and link it.
- **Zero uniqueness signals.** No first-party benchmark, no dataset, no "we tested N files" — nothing an AI cannot get from Google's own docs. A single real benchmark table (e.g. 50 PNG screenshots, median size before/after per quality setting, measured on this tool) would be the most citable asset the site could own. Measure it; do not invent numbers.
- **Zero passages in the 134–167-word band.** The "Why…" intros are 168–190 words (trim ~20 words each); the FAQ answers are 20–40 words (expand the top two per page to ~60–80 words with a number and a named source).
- Blocks with `<ol>`/`<table>` lose points in the scorer because cell text concatenates without separators; keep the tables, but add one summary sentence with numbers immediately after each.

### 3.3 Concrete rewrites (openings only)

- `/png-to-webp` hero → "**PNG to WebP conversion** re-encodes a PNG image into Google's WebP format, typically cutting file size 26% (lossless) to 60–80% (lossy) while keeping full alpha transparency. Compressly does this in the browser with libwebp compiled to WebAssembly — no upload."
- `/compress-webp` hero → "**Compressing a WebP** means re-encoding it at a lower quality setting without changing format. Dropping from quality 90 to 75 usually removes 30–60% of the bytes with no visible change at screen size. Free for batches of 20 files up to 25 MB each."
- `/compress-webp` FAQ "How do I make a WebP smaller?" → "To make a WebP file smaller, re-encode it at a lower quality (75 is the usual sweet spot; 90→75 typically saves 30–60%)… Compressly's free tier processes 20 files per batch locally in the browser."

---

## 4. llms.txt — Score 0/100 (Absent; and soft-404s as HTML)

`/llms.txt` and `/llms-full.txt` return HTTP 200 **text/html** (the SPA shell). There is no llms.txt. Fewer than 5% of sites have one; for a brand with no entity footprint it is the cheapest way to hand AI systems the correct facts (pricing, limits, formats) and stop them guessing from the iOS apps.

Deployment notes (for whoever implements): drop the file at `public/llms.txt`; Cloudflare Pages serves static assets before the SPA fallback, so it will be served as `text/plain`. Add to `public/_headers`:

```
/llms.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
```

Also fix the soft-404 (`public/404.html`) so `/llms-full.txt` returns a real 404 until one exists.

### Recommended `llms.txt` (DRAFT — not written to the site)

Facts below are taken verbatim from the live site/source. Items marked `[FILL]` are unknown and must not be guessed.

```markdown
# Compressly

> Compressly (getcompressly.com) is a free, browser-based image compressor and converter for JPG, PNG, WebP, AVIF and JXL. All processing runs locally via WebAssembly — files are never uploaded. Pro is a $39 one-time license.

## Docs

- [Compressly — Free Online Image Compressor](https://getcompressly.com/): Main tool. Batch-compress and convert JPG, PNG, WebP, AVIF and JXL in the browser; quality slider, resize, lossless mode, ZIP download. Free tier and Pro pricing, features and FAQ.
- [Convert PNG to WebP](https://getcompressly.com/png-to-webp): PNG→WebP with alpha transparency preserved; lossless WebP ~20–30% smaller than PNG, lossy 60–80% smaller. Three-step guide, PNG vs WebP table, FAQ.
- [Convert JPG to WebP](https://getcompressly.com/jpg-to-webp): JPG/JPEG→WebP at the same visual quality, typically 25–35% smaller. Quality guidance (75–85 for photos), JPG vs WebP table, FAQ.
- [Convert WebP to PNG](https://getcompressly.com/webp-to-png): WebP→PNG for universal compatibility and editing; lossless, transparency kept, no quality gain over a lossy source. FAQ.
- [Convert WebP to JPG](https://getcompressly.com/webp-to-jpg): WebP→JPG for email, marketplaces and older apps; transparency is flattened to a solid background; quality 80–90 recommended. FAQ.
- [Compress WebP](https://getcompressly.com/compress-webp): Re-encode existing WebP files at a lower quality without changing format; 90→75 typically cuts 30–60%. Lossless mode for diagrams and text. FAQ.

## Key Facts

- Product: Compressly, a client-side (static) web app for image compression and format conversion. No signup, no upload, no watermark; works offline once loaded.
- Supported formats (decode and encode): JPG, PNG, WebP, AVIF, JXL (JPEG XL).
- Encoders: MozJPEG, OxiPNG, libwebp, libavif and libjxl compiled to WebAssembly (jSquash / Squoosh codec family). Multi-threaded via Web Workers.
- Free tier: up to 20 files per batch, 25 MB per file, JPG/PNG/WebP/AVIF, quality slider and resize, ZIP download.
- Pro: $39 one-time (lifetime, no subscription). Unlimited batch size, 200 MB per file, JXL encoding and decoding, lossless mode (PNG/WebP/AVIF/JXL), EXIF preservation, advanced encoder controls (effort, chroma), unlimited devices, lifetime updates.
- Billing: Lemon Squeezy; 14-day money-back guarantee; VAT handled automatically.
- Versus alternatives: unlike TinyPNG (server upload, JPG/PNG/WebP only) and Squoosh (one image at a time), Compressly is local-only with true batch processing and ZIP export.
- Website launched: September 2026. Company/founder: [FILL — do not guess]. Location: [FILL].
- Not affiliated with the iOS App Store apps named "Compressly" by other developers.

## Legal

- [Privacy](https://getcompressly.com/privacy.html): Privacy policy — no image data leaves the device.
- [Terms](https://getcompressly.com/terms.html): Terms of service and license terms.

## Contact

- Website: https://getcompressly.com
- Email: hello@getcompressly.com
- Support: hello@getcompressly.com
```

---

## 5. ENOUGH — What happens after a citation

- **Checkout is broken in production.** The live bundle `/assets/index-0CeCobE2.js` contains the constant-folded string `nh="https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID"` — i.e. `VITE_LS_CHECKOUT_URL` was unset at build time, so "Get Pro — $39" links to a placeholder host. The local `dist/assets/index-0CeCobE2.js` has the same hash and the same placeholder, confirming the deployed build. (License *validation* correctly targets `https://api.lemonsqueezy.com/v1/licenses`.) Any AI-referred buyer hits a dead link.
- **No linkable pricing, FAQ, about, or comparison URL.** Pricing and FAQ are `#pricing`/`#faq` anchors inside the SPA; AI answer engines cite URLs, not anchors, and can only send users to `/`. "Compressly vs TinyPNG/Squoosh" exists only as one FAQ answer.
- **Broken social/answer-engine preview:** `og.png` does not exist (returns HTML). Perplexity/ChatGPT/Slack/X cards will render without an image.
- **Contact** exists only as a `mailto:` in the JS-rendered footer — invisible to non-JS crawlers; the llms.txt draft above fixes this.

---

## Priority Actions

1. **[HIGH — Read] Make the homepage readable without JavaScript.** Pre-render the React tree into `index.html` at build time (`react-dom/server` `renderToString` in a small Vite build step, or a prerender plugin) so `#root` ships hero H1 + definition paragraph, feature list, pricing table and **all 8 FAQ answers** as `<details>` elements (change `FAQ.tsx` from conditional rendering to always-in-DOM). Expected effect: homepage citability 10 → ~68; site citability 42 → ~52; composite 40 → ~44 before any brand work.
2. **[HIGH — Enough] Fix the Pro checkout URL.** Set `VITE_LS_CHECKOUT_URL` to the real Lemon Squeezy buy link in the Pages build environment and redeploy; verify the bundle no longer contains `YOUR-STORE`.
3. **[HIGH — Found] Ship `public/llms.txt` (draft above) + `public/404.html` + `public/og.png` (1200×630) + `apple-touch-icon.png`.** Add the `_headers` rule for `/llms.txt`. Add `Content-Signal` and explicit `OAI-SearchBot`, `ChatGPT-User`, `Google-Extended`, `Applebot-Extended` blocks to `robots.txt`. Add a `www → apex` 301 redirect rule.
4. **[HIGH — Found/Cited] Anchor the entity.** Add `Organization` (name "Compressly", `url`, `logo`, `email`, `sameAs` → GitHub org, LinkedIn page, X, Product Hunt once created) and link it as `publisher`/`author` on `SoftwareApplication`; add `datePublished`. Claim `@getcompressly` handles (since `@compressly` is taken on YouTube) and use "Compressly (getcompressly.com)" consistently off-site. Create a Wikidata item for the software (no Wikipedia article needed). Then seed mentions: Show HN, Product Hunt launch, 2–3 tutorial videos on a brand YouTube channel, authentic posts in r/webdev / r/web_design / r/SideProject (manual, no automation).
5. **[MEDIUM — Cited] Citability rewrites on the 5 landing pages.** Add a definition sentence under each H1; trim the "Why…" intros to 134–167 words; cite Google's WebP documentation for the size-reduction figures; expand the top two FAQ answers per page to 60–80 words with a number; align JSON-LD FAQ text 1:1 with the visible `<details>`; publish one real first-party benchmark table. Then add static `/pricing`, `/faq`, and `/compressly-vs-tinypng-vs-squoosh` pages built like the landing pages.
6. **[LOW] Sitemap hygiene** — update `lastmod` when pages change; list `privacy.html`/`terms.html` only if you want them cited; add the new static pages when created.

---

### Evidence files (scratchpad)

Raw fetches, scorer JSON (`cit_*.txt`), `brand_scan.txt`, and the downloaded bundle are in `/private/tmp/claude-501/-Users-j/ff2480b3-8681-461f-95b9-b48d3fd6740d/scratchpad/geo/`.
