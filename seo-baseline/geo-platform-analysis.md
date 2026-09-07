# Platform Readiness Analysis — getcompressly.com

Date: 2026-09-04 (site launched today)
Analyst: geo-platform-analysis subagent
Scope: analysis only. Evidence gathered by live fetches against https://getcompressly.com (curl with `--retry 3`, 13 crawler user-agents), local source inspection (read-only), Ahrefs public DR, Bing/DuckDuckGo index probes, web search. Reddit MCP server failed to connect this session; Reddit checks were done via web search only.

**Platform Optimization category score: 30/100** (Platform Readiness Average across the five platforms)

## Platform Scores Overview

| Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 42/100 | Fair — structure-ready, authority-blocked |
| Bing Copilot | 32/100 | Poor — zero Bing index, no WMT/IndexNow |
| ChatGPT Web Search | 30/100 | Poor — Bing-backed, zero Bing index, entity collision |
| Perplexity AI | 25/100 | Poor — no community signal, no dates, homepage unreadable |
| Google Gemini | 21/100 | Critical — zero Google-ecosystem footprint |

**Strongest Platform:** Google AI Overviews — Googlebot renders the React homepage, GSC is verified with the sitemap submitted, and the five static landing pages already carry the AIO-friendly patterns (comparison table, 3-step ordered list, FAQ, HowTo/FAQPage/Breadcrumb schema). What blocks it is authority, not format: DR 0, no backlinks, no rankings.

**Weakest Platform:** Google Gemini — no YouTube, no Knowledge Graph entity, no Organization schema, no images (0 `<img>` on every landing page), no About page. Gemini leans on Google-owned properties and entity data; Compressly has none of it yet.

---

## What each platform can actually read (crawler-access matrix)

Live tests on 2026-09-04. Every UA received HTTP 200 on `/` and `/png-to-webp` with no `cf-mitigated` header, i.e. Cloudflare's AI-bot blocking is OFF and robots.txt (`User-agent: *` Allow + explicit GPTBot/ClaudeBot/PerplexityBot) is honoured.

| Platform | Crawler(s) tested | robots.txt | Live HTTP | Homepage `/` readable? | 5 landing pages readable? | Index status |
|---|---|---|---|---|---|---|
| Google AIO | Googlebot | allowed | 200 | Yes — Google executes JS (subject to render-queue delay) | Yes (SSR static HTML, 651–726 body words) | GSC verified, sitemap submitted; indexed-page count unverifiable from here — check GSC Pages report |
| ChatGPT | OAI-SearchBot, ChatGPT-User, GPTBot | allowed (OAI-SearchBot / ChatGPT-User covered only by `*`) | 200 / 200 / 200 | **No** — body is `<div id="root"></div>`, 0 words, no `<noscript>`. Only `<title>`, meta description and JSON-LD (SoftwareApplication, WebSite, FAQPage with 6 Q&As) are visible | Yes | **Bing index: 0 pages** (`site:getcompressly.com` → Bing "There are no results", DuckDuckGo 0 results) |
| Perplexity | PerplexityBot, Perplexity-User | allowed | 200 / 200 | **No** (same as above; Perplexity does limited JS execution) | Yes | Own index; nothing expected yet |
| Gemini | Googlebot, Google-Extended | allowed | 200 / 200 | Yes (via Google render) | Yes | Google index |
| Bing Copilot | bingbot | allowed | 200 | **Unreliable** — bingbot renders JS with a much smaller budget than Google | Yes | **0 pages** |

Also tested and passing: ClaudeBot, Applebot, CCBot, Bytespider, meta-externalagent (all 200). Helper-script confirmation: `fetch_page.py /` → `word_count: 13, has_ssr_content: False`; `citability_scorer.py /` → 0 blocks analysed; `citability_scorer.py /png-to-webp` → 6 blocks, average 52.5 (1 B, 3 C, 2 D, 0 A).

### Site-level technical findings that affect all platforms

1. **SPA catch-all returns HTTP 200 for every unknown path.** `/this-does-not-exist-xyz`, `/about`, `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/BingSiteAuth.xml`, `/.well-known/indexnow-key.txt` all return the 6,047-byte homepage shell with `200 text/html`. Consequences: soft-404s in GSC/Bing WMT; any agent that fetches `/llms.txt` receives HTML (worse than a clean 404 — `llmstxt_generator.py` reports `exists: True, format_valid: False`); an IndexNow key file at that path would fail verification.
2. **`https://www.getcompressly.com/` serves 200 without redirecting to the apex**, and `https://compressly-3wn.pages.dev/` is also 200 with no `X-Robots-Tag`. Both carry `<link rel="canonical" href="https://getcompressly.com/">`, which Google respects; Bing treats canonical as a hint and is more literal about duplicate hosts.
3. **FAQPage schema does not match visible FAQ text on all 5 landing pages.** Example `/png-to-webp`: schema asks "How much smaller is WebP than PNG?" / "Can I convert many PNGs at once?", the page shows "How much smaller will my files be?" / "Is there a file-size or batch limit?" / "Do I need to install anything?". Google's structured-data policy requires FAQ content to be visible on the page; mismatched pairs risk being ignored. Non-JS crawlers see only the schema version, Google AIO sees only the visible version — the two audiences currently get different facts.
4. **No dates anywhere.** No `datePublished`/`dateModified`, no visible "Updated" line. `sitemap.xml` `lastmod` is `2026-07-24` on every URL, which predates today's launch and looks stale to every freshness-weighted platform (Perplexity, AIO).
5. **No Organization schema, no `sameAs`, no author, no About page** (`/about` is the SPA shell). Entity grounding is limited to a `SoftwareApplication` node.
6. **Zero outbound citations** on any page (`external_links: []` apart from Google Fonts). Zero images on landing pages (`images: 0`).
7. **Brand-name collision (entity ambiguity).** Web search for "Compressly image compressor" returns compressly.net, compressly.in, compressly.co and github.com/asaumet230/compressly — all live browser-based image compressors. A search for "getcompressly" returns GetCompress (getcompress.com, Product Hunt July 2026, macOS media compressor). getcompressly.com appears in neither result set. LLM platforms resolve entities by name; today the name resolves to competitors.
8. **Ahrefs Domain Rating: 0.0.** No referring domains.
9. **Internal-link hygiene:** landing pages and the React footer link to `/privacy.html`, which 308-redirects to `/privacy`; landing-page footers link only 3 of the 5 sibling pages (the "More conversions" block links all 4, so no orphan).
10. **Out of GEO scope but blocking trust/conversion:** the live bundle `/assets/index-0CeCobE2.js` contains `lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` — `VITE_LS_CHECKOUT_URL` was not set at build time, so the "$39 Pro" button points at a placeholder. Google renders this page; pricing claims that lead to a dead checkout are a poor trust signal.

Performance note: TTFB measured ~0.75–0.85 s from this sandbox through a proxy (not representative of real users). HTML payloads are tiny (6–10 KB); landing pages load Google Fonts as a render-blocking stylesheet; the homepage loads a 347 KB JS bundle and lazily up to ~15 MB of WASM codecs. `cf-cache-status: DYNAMIC` on HTML.

---

## Google AI Overviews

**Score: 42/100**

| Signal Category | Score | Key Findings |
|---|---|---|
| Content Structure | 20/40 | Landing pages: H1 + 7 H2s, one 4-row comparison table (PNG vs WebP etc.), one 3-step `<ol>`, 4-question FAQ in `<details>/<summary>` (questions are not headings). H2s are topical ("Why move PNG to WebP", "PNG vs WebP, honestly") rather than query-phrased; no H2 is a literal question. The first paragraph under the first H2 is narrative — the quotable fact ("lossless WebP 20–30% smaller, lossy 60–80%") sits in paragraph 3, not in an answer block directly under the heading. No definition pattern ("WebP is…"). FAQ count 4 (< 5). Homepage (rendered): 8-question FAQ, 6-feature grid, pricing lists — but no tables and the hero H1 is marketing copy. |
| Source Authority | 4/30 | DR 0, no backlinks, launched today, not ranking for anything. 92% of AIO citations come from top-10 pages; the "png to webp" SERP is owned by Cloudinary, Picflow, CloudConvert, ezgif, toWebP.io, Pixelied, ImageResizer, FreeConvert. No outbound citations supporting the 25–80% claims (ezgif publishes the same numbers, so they are verifiable but not unique). ~700 words per page is adequate, not comprehensive. |
| Technical Signals | 18/30 | Clean H1→H2 hierarchy, semantic HTML (`article`, `table`, `ol`, `details`). Schema present: HowTo + FAQPage + BreadcrumbList (landing), SoftwareApplication + WebSite + FAQPage (home). Deductions: FAQ schema ≠ visible text on all 5 pages; homepage is client-rendered (indexing delay, no `<noscript>`); soft-404 catch-all; www and pages.dev duplicates rely on canonical alone; no dates; render-blocking Google Fonts. |

**Optimization Actions:**
1. Add a 40–60-word direct-answer block immediately under each landing-page H1 (before the CTA row), e.g. `/png-to-webp`: "Converting PNG to WebP typically cuts file size 25–80% while keeping the alpha channel. Lossless WebP is ~20–30% smaller than PNG; lossy WebP at quality 75 is usually 60–80% smaller with no visible difference. Compressly does the conversion in your browser with libwebp compiled to WebAssembly, so nothing is uploaded." Then rephrase the first H2 as the query: "Why convert PNG to WebP?".
2. Convert the FAQ from `<details>/<summary>` to `<h3>` question + `<p>` answer, grow each page to 6–8 questions, and make the FAQPage JSON-LD text identical to the visible text (generate both from one source).
3. Add `datePublished` / `dateModified` to every page (Article or WebPage node) plus a visible "Updated 4 Sep 2026" line; correct `sitemap.xml` `lastmod` to real dates.

---

## ChatGPT Web Search

**Score: 30/100**

| Signal Category | Score | Key Findings |
|---|---|---|
| Entity Recognition | 2/35 | No Wikipedia, no Wikidata, no Crunchbase/Product Hunt/LinkedIn/GitHub footprint for this brand. No Organization schema, no `sameAs`. Worse than absent: "Compressly" already resolves to compressly.net / .in / .co and a GitHub repo, and "getcompressly" resolves to GetCompress. ChatGPT will attribute the wrong product. |
| Content Preferences | 14/40 | What OAI-SearchBot sees on `/`: title, meta description, and JSON-LD only (the FAQPage JSON-LD does contain 6 quotable answers, including the useful "How does Compressly differ from TinyPNG or Squoosh?"). Landing pages are readable, factual and concise, with specific numbers (20 files/batch, 25 MB, $39 one-time, 25–80%). Missing: author byline, dates, sources, About/company description, any page over ~720 words (ChatGPT favours single comprehensive sources, 2,000+ words). |
| Crawler Access | 14/25 | robots.txt allows GPTBot explicitly; OAI-SearchBot and ChatGPT-User are covered by `*`. All three verified 200 with no Cloudflare mitigation. But ChatGPT search runs on Bing's index and **Bing has zero pages** for the domain; there is no Bing Webmaster Tools verification (`msvalidate.01` absent, `BingSiteAuth.xml` returns the SPA shell). Homepage empty for the crawler. |

**Optimization Actions:**
1. Register the site in Bing Webmaster Tools today (use "Import from Google Search Console" — one click), submit `sitemap.xml`, and request indexing of the 6 URLs via URL Submission. This is the gating item for both ChatGPT and Copilot.
2. Ship a server-rendered/pre-rendered homepage (see Cross-Platform #1) so OAI-SearchBot gets the hero, features, pricing and 8 FAQs as HTML instead of an empty `#root`.
3. Add Organization JSON-LD (`name`, `url`, `logo`, `email: hello@getcompressly.com`, `sameAs` → GitHub org, X, LinkedIn, Product Hunt once created) and a static `/about` page stating what Compressly is, who builds it, and how it differs from the other "Compressly" sites. Name OAI-SearchBot and ChatGPT-User explicitly in robots.txt for clarity.

---

## Perplexity AI

**Score: 25/100**

| Signal Category | Score | Key Findings |
|---|---|---|
| Community Validation | 0/30 | No Reddit, Hacker News, Stack Overflow, Quora, Product Hunt or review-site mentions found (brand launched today; Reddit MCP unavailable, web-search check only). Perplexity sources ~47% of citations from Reddit. |
| Source Directness | 9/30 | The landing pages are THE primary source for Compressly's own facts (limits, pricing, codecs used), which Perplexity can cite directly. Format facts (25–80%) are secondary and identical to competitors'. No original data, benchmarks, or research — despite the product being uniquely positioned to publish real encoder benchmarks. |
| Content Freshness | 4/20 | No visible or structured dates; sitemap `lastmod` 2026-07-24 predates launch. Perplexity deprioritises undated/stale content most aggressively of the five. |
| Technical Access | 12/20 | PerplexityBot allowed and verified 200 (Perplexity-User also 200). Landing pages are static HTML — good. Homepage is client-rendered, so Perplexity's limited JS execution sees nothing. `/llms.txt` returns HTML with 200 (misleading rather than absent). |

**Optimization Actions:**
1. Publish an original benchmark page ("500 real images through MozJPEG, libwebp, libavif, libjxl: size vs. SSIM at quality 60/75/90") as an HTML table with methodology and date — this is the single most Perplexity-citable asset a client-side compressor can produce, and it also feeds AIO tables and Gemini depth.
2. Launch on Product Hunt and Hacker News ("Show HN: Compressly — batch AVIF/JXL compression fully in-browser, no upload"), then answer questions authentically in r/webdev, r/web_design, r/photography threads about image compression / privacy. Do not automate Reddit.
3. Add real `public/llms.txt` (title, one-line description, sections listing the 5 tool pages + About + Pricing) and `llms-full.txt`, and put `dateModified` on every page.

---

## Google Gemini

**Score: 21/100**

| Signal Category | Score | Key Findings |
|---|---|---|
| Google Ecosystem | 2/35 | No YouTube channel or videos, no Google Business Profile (arguably N/A for a web tool), no Google News/Scholar, no Chrome Web Store listing. Only GSC verification exists. |
| Knowledge Graph | 5/30 | No Knowledge Panel. `SoftwareApplication` schema provides basic entity typing (+), but no Organization node, no `sameAs`, no consistent cross-property NAP. Brand-name ambiguity with three other "Compressly" sites actively works against KG resolution. |
| Content Quality | 14/35 | Google renders the homepage, so Gemini does get the full app content. The 5 landing pages form a small, well-interlinked WebP cluster (+). Deductions: text-only — 0 images, 0 alt text, no video; ~700 words each (Gemini prefers depth); cluster covers only WebP while the product's differentiators (AVIF, JXL, batch, lossless) have no crawlable page; no author/about/editorial signals. |

**Optimization Actions:**
1. Record 60–90-second screen-capture videos for each landing page task ("Convert 100 PNGs to WebP in the browser — no upload") on a Compressly YouTube channel with chapters and full-URL descriptions; embed each on its landing page with `VideoObject` schema.
2. Add at least one descriptive image per landing page (before/after size comparison, a 1200-px screenshot of the tool) with keyword alt text and structured filenames (`png-to-webp-size-comparison.webp`), plus `ImageObject` in the schema.
3. Extend the topical cluster: `/compress-jpg`, `/compress-png`, `/png-to-avif`, `/jpg-to-avif`, `/avif-to-jpg`, `/jpeg-xl-converter`, `/compress-image` (the head term), and a `/compare/compressly-vs-tinypng-vs-squoosh` page built from the existing FAQ answer.

---

## Bing Copilot

**Score: 32/100**

| Signal Category | Score | Key Findings |
|---|---|---|
| Bing Index Signals | 3/30 | No Bing Webmaster Tools (no `msvalidate.01`, `BingSiteAuth.xml` is the SPA shell). No IndexNow (key path returns HTML; verification would fail). Bing index coverage: 0 pages. `sitemap.xml` exists and is referenced in robots.txt (+). |
| Content Preferences | 19/30 | Meta descriptions are present and well-written on all 6 pages (Bing weights them). Exact-match keywords in titles and H1s ("Convert PNG to WebP", "Compress WebP") — strong for Bing's literal matching. Clear structure, professional tone. No citations/sources. |
| Microsoft Ecosystem | 0/20 | No LinkedIn company page, no public GitHub repository (the codebase is built on open-source jSquash/Squoosh codecs — an easy GitHub story), no social accounts. |
| Technical Signals | 10/20 | Static landing pages are light (<10 KB HTML) and mobile-viewport ready (+). Homepage is client-rendered (bingbot's JS rendering is far less reliable than Google's). www host serves 200 without redirect. Soft-404 catch-all wastes Bing crawl budget and is penalised more by Bing than Google. |

**Optimization Actions:**
1. Bing Webmaster Tools: verify via GSC import (or add `<meta name="msvalidate.01">` to `index.html` and each landing page), submit sitemap, submit the 6 URLs.
2. Implement IndexNow: put the key file in `public/<key>.txt` (static files take precedence over the SPA fallback on Cloudflare Pages), ping `https://api.indexnow.org/indexnow?url=...&key=...` from the deploy script on every publish. Simultaneously add `public/404.html` so unmatched routes return a real 404 (the app has no client-side routes — only `/?to=` query params — so disabling the SPA fallback is safe) and add `public/_redirects` with `https://www.getcompressly.com/* https://getcompressly.com/:splat 301`.
3. Create a LinkedIn company page and a public GitHub org/repo (even just the landing-page generator or an "awesome image codecs" doc), and link both from Organization `sameAs`.

---

## Cross-Platform Synergies

1. **Pre-render / server-render the homepage** (vite-react-ssg, `vite-plugin-prerender`, or at minimum ship the hero, feature list, pricing table and FAQ as real HTML inside `<div id="root">` for React to replace on mount) — Impacts: ChatGPT, Perplexity, Bing Copilot, plus faster Google/Gemini indexing.
2. **Organization schema + `sameAs` + About page + distinct brand footprint** (Product Hunt, GitHub, LinkedIn, X) — Impacts: ChatGPT, Gemini, Perplexity, Copilot. This is also the only defence against the compressly.net/.in/.co and GetCompress name collisions.
3. **Original benchmark data as HTML tables with dates** — Impacts: Google AIO, Perplexity, Gemini, ChatGPT.
4. **Dates everywhere + correct sitemap lastmod + real llms.txt + real 404s + www→apex 301** — Impacts: all five (freshness for Perplexity/AIO, crawl hygiene for Bing/ChatGPT, agent-readability for every LLM fetcher).
5. **FAQ as H3 + matching schema, direct-answer block under H1** — Impacts: Google AIO, Gemini, Copilot, ChatGPT.

## Priority Actions (All Platforms)

1. **[CRITICAL]** Register Bing Webmaster Tools (GSC import), submit sitemap + 6 URLs, then implement IndexNow with a static key file — Affects: ChatGPT, Bing Copilot — Effort: Low
2. **[CRITICAL]** Pre-render the homepage so `/` has server-side HTML content (hero, features, pricing, FAQ) instead of an empty `#root` — Affects: ChatGPT, Perplexity, Copilot, Gemini/AIO indexing speed — Effort: Medium
3. **[HIGH]** Entity grounding: Organization JSON-LD with `sameAs`, static `/about`, Product Hunt + GitHub + LinkedIn presence; decide how to disambiguate from the three existing "Compressly" compressors and GetCompress in all copy — Affects: ChatGPT, Gemini, Perplexity, Copilot — Effort: Medium
4. **[HIGH]** Crawl/agent hygiene bundle: `public/404.html` (kills soft-404s), `_redirects` www→apex 301, real `llms.txt`/`llms-full.txt`, fix `/privacy.html` links, align FAQ schema with visible text on all 5 pages, add `datePublished`/`dateModified` + visible dates, fix sitemap `lastmod` — Affects: all five — Effort: Low
5. **[HIGH]** Citability content: direct-answer block under each H1, FAQ as H3 (6–8 Qs), original codec benchmark page with tables, extend cluster to AVIF/JXL/compress-jpg/compress-png/compress-image and a vs-TinyPNG/Squoosh comparison page, add one image + one video per landing page — Affects: AIO, Perplexity, Gemini, ChatGPT — Effort: Medium–High
6. **[MEDIUM, out of GEO scope]** Set `VITE_LS_CHECKOUT_URL` and rebuild — the live bundle links the Pro button to `lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` — Affects: trust/conversion on every platform that renders the page — Effort: Low

## Evidence log

- Crawler UA tests (13 UAs × `/` and `/png-to-webp`): all HTTP 200, `server: cloudflare`, no `cf-mitigated`.
- Response headers `/`: `content-type: text/html`, `cache-control: public, max-age=0, must-revalidate`, COOP/COEP set, `cf-cache-status: DYNAMIC`, no `X-Robots-Tag`.
- Soft-404 probes: `/this-does-not-exist-xyz`, `/llms.txt`, `/about`, `/BingSiteAuth.xml`, `/.well-known/indexnow-key.txt` → 200, 6,047 B HTML. `/png-to-webp.html`, `/index.html`, `/privacy.html` → 308.
- Host variants: `http://getcompressly.com/` → 301 https apex; `https://www.getcompressly.com/` → 200 (no redirect); `https://compressly-3wn.pages.dev/` → 200, canonical → apex.
- Landing pages: body words 726 / 687 / 658 / 651 / 682; each: 1 table, 1 `<ol>`, 0 `<ul>`, 0 `<img>`, 0 external links, 3 JSON-LD blocks (BreadcrumbList, HowTo with 3 steps, FAQPage with 4 Qs), meta description + canonical present, no dates, no author.
- Homepage head JSON-LD: SoftwareApplication (2 Offers: $0, $39), WebSite, FAQPage (6 Qs). Body: `<div id="root"></div>` only; no `<noscript>`.
- Index probes: Bing `site:getcompressly.com` → "There are no results for"; DuckDuckGo → 0 results; Ahrefs public DR 0.0.
- Name collisions (web search): compressly.net, compressly.in, compressly.co, github.com/asaumet230/compressly ("Compressly"); getcompress.com / Product Hunt "GetCompress" ("getcompressly").
- Helper scripts: `fetch_page.py` (`has_ssr_content: False`, 13 words on `/`; 711 words on `/png-to-webp`), `citability_scorer.py` (`/` 0 blocks; `/png-to-webp` avg 52.5, best block "Why move PNG to WebP" 65/B), `llmstxt_generator.py` (`exists: True, format_valid: False`).
- Live bundle `/assets/index-0CeCobE2.js` contains `lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` (1 match).
