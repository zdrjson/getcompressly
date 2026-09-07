# Second-Opinion Critique — Traditional SEO Lens on the GEO Baseline (34/100)

**Reviewer role:** SEO specialist (organic Google / Bing rankings, not AI citation)
**Date:** 2026-09-04 (launch day) · **Scope:** analysis only, no site files touched
**Inputs read:** GEO-AUDIT-REPORT.md + geo-technical / geo-content / geo-schema / geo-platform-analysis / geo-ai-visibility
**Own verification:** raw HTML of `/`, `/png-to-webp`, `/compress-webp` (live pages.dev mirror + local `dist/`), `public/sitemap.xml`, `public/_headers`, `src/App.tsx`, `src/components/Pricing.tsx`; 18 SERP sanity searches (US web search — result ordering is a proxy, NOT a Google rank export); Bing `site:` probe.
**Could not measure:** PageSpeed Insights API returned HTTP 429 twice from the sandbox → no lab/field Core Web Vitals; CWV below is static-analysis risk only. Google `site:` count not testable here.

**Data-provenance rule used throughout:** every search volume / KD quoted is from Ahrefs as recorded in `geo-content.md` (US, 2026-09-04). No volumes are quoted for long-tail terms — those are marked "SERP observed, volume unverified". All traffic numbers in §6 are estimates and labelled as such.

---

## 0. One-paragraph verdict

The baseline is a good GEO audit and a mediocre SEO audit. It correctly says "length is not the lever" and "authority is the blocker", but then ranks fixes by what AI crawlers see rather than by what moves Google rankings or clicks. For Google, the two things that matter most were missed or buried: (1) **the five landing pages do not contain the tool** — every page sends the user to `/?to=webp#tool`, an intent mismatch on transactional "png to webp"-type queries and a textbook intermediate-page pattern; (2) **the site has zero referring domains and no link plan** — nothing in the 30-day plan earns a link except "launch on PH/HN" in week 4. Several "Critical/High" items (schema text sync, llms.txt, security headers) have ~zero Google ranking effect and should be relabelled as cheap hygiene, not blockers.

---

## 1. Critical / High items re-scored: Google ranking vs AI citation

Legend: ranking impact = effect on Google/Bing organic positions and clicks; AI impact = effect on ChatGPT/Perplexity/AIO citation. Effort as stated in baseline.

| ID | Baseline label | Google ranking impact | AI citation impact | Verdict | Why |
|---|---|---|---|---|---|
| C1 Pre-render homepage | Critical, #1 | **Medium** | **High** | **Keep high, but reframe.** #1 for GEO; for Google it is a speed-of-indexing + LCP + FAQ-in-DOM fix, not a ranking unlock. | Google renders JS (Search Central: pages with 200 go to a render queue; delay "seconds… can take longer"). So Google *will* index the ~587 rendered words. Real Google benefits: (a) links to the 5 landing pages appear in initial HTML → faster discovery/PageRank flow; (b) hero text becomes LCP without waiting for 108 KB br JS → CWV; (c) `FAQ.tsx` renders 7/8 answers conditionally, so even rendered Googlebot never sees them — that is a genuine Google content loss; (d) Bing's renderer is weaker. None of this changes the authority gap. |
| C2 Factual errors | Critical | **Low** | Medium | **Downgrade to Medium (fix anyway, 15 min).** | Google does not fact-check "Google's MozJPEG". Fix for trust/PR credibility, not rankings. |
| C3 FAQ/HowTo JSON-LD ≠ visible text | Critical | **Low** | Medium | **Downgrade to Medium hygiene.** | FAQ rich results are gov/health-only (Aug 2023) and HowTo rich results are gone (Sep 2023) — the baseline's own schema report says so. There is no SERP feature to lose. The manual-action risk for mismatched markup exists in policy but is rare in practice; the realistic outcome is Google ignores the block. Do the 10-minute copy-sync because it is free, not because it is Critical. |
| C4 Zero Bing index / no WMT | Critical | **Medium (Bing only)** | High | **Keep — but note the baseline's evidence is internally contradictory.** | `geo-ai-visibility.md` §1.5 says Bing *does* index the domain ("about 440 results"); `geo-platform-analysis.md` says 0. My own Bing `site:` probe showed no getcompressly.com URLs (corroborates 0, but the sandbox got a localised results page). Verify inside Bing WMT after registration before calling it "Critical". Bing WMT + IndexNow is a 20-minute user action either way. |
| C5 Dead $39 checkout | Critical (business) | none | none | **Keep #1 overall.** Not SEO, but nothing else matters if buyers 404. |
| H1 Soft-404 / no `404.html` | High | **Low–Medium** | High | **Downgrade for Google; keep for og:image.** | Crawl budget is irrelevant for a 6-page site (Google: budget concerns start at very large sites). Real Google-side cost: GSC "Soft 404" noise and `og:image` serving HTML. Fix is one file; do it in week 1 but it is not a ranking lever. |
| H2 llms.txt | High | **None** | Low–Medium | **Downgrade to Low.** | Google has said it does not use llms.txt and is not planning to (Gary Illyes, Search Central Live, Jul 2025; John Mueller compared it to the keywords meta tag). Other engines' adoption is unconfirmed. Ship it because it costs 5 minutes; do not schedule around it. |
| H3 www duplicate host | High | **Low–Medium** | Medium | **Keep as week-1 hygiene.** | Canonicals already consolidate for Google; the 301 protects future inbound links that land on www and stops Bing treating it literally. One `_redirects` line. |
| H4 Brand entity collision | High | **High (for brand SERP)** | High | **Keep High — for a classic reason the baseline under-states.** | "compressly" is currently owned by compressly.net/.in/.co and iOS apps. The first ranking milestone for any new brand is #1 for its own name; that needs Organization schema, an About page, and 3–5 owned profiles that link to the apex. This is also the first 3–5 referring domains. |
| H5 Minimal schema | High | **Low** | Medium | **Downgrade to Medium.** | SoftwareApplication is not rich-result eligible without ratings (correctly omitted). Organization/@id graph helps entity resolution, not rankings. Breadcrumb is the only eligible type and it already validates. |
| H6 Landing pages lack evidence | High | **Medium** | High | **Keep High — but the missing "evidence" for Google is the TOOL, not text.** See §3A. |
| H7 Security headers | High | **None** | None | **Downgrade to Low.** | HTTPS is the only security ranking signal; HSTS/CSP/XFO have no ranking effect. Good practice, not SEO. |
| H8 Missing og.png / icons | High | **Low** | Medium | **Medium.** Affects social CTR and link-share previews (which affect link acquisition). |
| M1 Content breadth | Medium | **High** | High | **Upgrade to High** — this is where the organic traffic will actually come from (§2), with the doorway caveat in §3K. |
| M5 WASM not edge-cached | Medium | Low (not CWV) | none | Keep Medium for UX; see §3E for why it is not a CWV issue. |

**Net effect on ordering:** C1 stays near the top but for different reasons; C3/H2/H7 drop out of the top 10; "tool-on-landing-page" and "link acquisition" enter the top 5.

---

## 2. Keyword & SERP reality check

### 2.1 The five head terms (Ahrefs, US, 2026-09-04 — as recorded in geo-content.md)

| Keyword | Vol | KD | #1 (DR) | Top-10 DR range | SERP composition observed (my searches) | DR-0 in 90 days? |
|---|---|---|---|---|---|---|
| webp to png | 163,000 | 30 | CloudConvert (82) | 62–96 | cloudconvert, picflow, ezgif, cloudinary, freeconvert, adobe, canva… | **No.** Not top-20. Top-50 only if a viral launch produces 30+ RDs. |
| webp to jpg | 103,000 | 39 | CloudConvert (82) | 62–96 | cloudconvert, ezgif, picflow, canva, freeconvert | **No.** |
| png to webp | 8,700 | 26 | CloudConvert (82) | 62–96 | cloudconvert, picflow, inpixio, ezgif, cloudinary, pixelied, imageresizer, freeconvert, onlinepngtools | **No** for top-10; top-30/50 conceivable by day 90 with 15–30 RDs. |
| jpg to webp | 6,100 | 35 | CloudConvert (82) | 62–96 | same cluster | **No** for top-10. |
| compress webp | 450 | 0 | TinyPNG (90) | mixed | edgeone, cloudinary, xconvert, 11zon, tinypng, imagekit, compresss.com, imgsmaller | **Yes, plausibly.** KD 0 means the current top-10 URLs have few referring links; page 1 with a handful of RDs is realistic. Low volume, but it is the one head term worth chasing now. |

Why the KD numbers understate the problem: Ahrefs KD is derived from referring-domain counts of the current top-10 URLs; the baseline measured CloudConvert's target URLs at 94–322 RDs each. A page with 0 RDs on a DR-0 domain does not outrank that on any amount of text.

### 2.2 Lower-competition variants worth targeting (SERP observed via web search; volumes unverified — do not plan revenue on them)

| Variant | Who ranks today (observed) | Read on competition | Fit with product |
|---|---|---|---|
| "squoosh alternative" (+ "batch", "bulk squoosh") | compresto.app, theimgapp.com, quickimg.io, picssizer.com, zipic.app, bulk-squoosh.vercel.app, alternativeto | Small/new sites dominate → **winnable** | Perfect: same codecs as Squoosh, adds batch. |
| "tinypng alternative no upload / free unlimited" | pixcloak, pickrack, tinypngnow, picssizer, orthogonal.info, privatetoolbox, wildandfreetools, imagera.ai | Tiny sites → **winnable** | Strong: local-only + batch is the exact pitch. |
| "compress images without uploading" | imagekit, imagecompressor.com, compressimage.io, lessmb blog, bulkpictools, offlinecompress | Mixed; blog-post slots exist → **plausible** | Core differentiator (DevTools-Network proof). |
| "png to webp no upload" / "batch png to webp" | imagekit, picflow, towebp.io, anywebp, tinyimagepro, pixlr, webconverters.net | Mid; several small sites → **plausible for top-20** | Modifier version of the head term. |
| "webp to png no upload / private" | nanoglobals, picflow, ezgif, towebp, anywebp, getwebp.com, photoformatlab, templateradar | Many small sites → **plausible** | Same. |
| "compress avif" / "avif compressor" | imagekit, cloudinary, edgeone, framebird, speedvitals, 11zon, youcompress, convertico, iloveavif | Mid; small-site slots → **plausible** | AVIF is in the free tier; few competitors do AVIF locally. |
| "avif to jpg" / "png to avif" | ezgif, imagekit, cloudconvert, picflow, freeconvert, convertio + avif2jpg.com, aslitools, iloveavif | Higher, but micro-sites hold page-1 slots | Free tier supports it. |
| "jpeg xl converter" / "jxl to jpg" / "jpg to jxl" | ezgif, gumlet, cloudinary, mconverter, vertopal, jpegxl.io, jpegxlconverter.com, convertico | Mid; fewer giants → attractive | **Blocked by product:** `Pricing.tsx` line 19 makes "JXL encoding + decoding" Pro-only. A tool-intent page that paywalls the tool will not rank and will bounce. Decision needed: make JXL *decode* free (small bundle) and keep encode Pro, or skip JXL pages. |
| "bulk image compressor" | compressimage.io, bulkimagepro, bulkimgresizer, imagecompressr, bulkpictools, bulkimagecompressor.com | Small/mid → **plausible** | Candidate primary for the homepage (§2.3). |

### 2.3 Cannibalization pre-check (no GSC data yet → sitemap + title/H1 method)

Current state is **clean**: six unique titles/H1s, no shared primary keyword. Two rules to keep it that way:

1. **Homepage owns "image compressor" and the batch/no-upload modifiers.** Do **not** build the `/compress-image` "head term" page that `geo-platform-analysis.md` proposes — it would compete with the homepage for its own primary. If a page for "compress image" is ever wanted, it *is* the homepage.
2. **One page per intent.** Build either `/squoosh-alternative` or `/compare/compressly-vs-squoosh`, not both. Build format-pair pages (`/png-to-avif`), not a generic `/avif-converter` that overlaps three pair pages.

### 2.4 Keyword-to-page map (defensible for a DR-0 site)

| Page | Primary keyword (owner) | Secondary / long-tail | 90-day goal (estimate) |
|---|---|---|---|
| `/` | brand "compressly"; "batch image compressor no upload" | "bulk image compressor", "image compressor no upload", "squoosh with batch" | #1 for brand; top-20 for one bulk/no-upload variant |
| `/png-to-webp` | png to webp converter (8,700) | png to webp no upload; batch png to webp; keep transparency | long-tail top-20; head top-50 |
| `/jpg-to-webp` | jpg to webp converter (6,100) | jpg to webp no upload; jpeg to webp quality | same |
| `/webp-to-png` | webp to png converter (163k) | webp to png no upload; webp to png transparent; bulk webp to png | long-tail top-20; head not top-50 |
| `/webp-to-jpg` | webp to jpg converter (103k) | webp to jpg no upload; batch webp to jpg | same |
| `/compress-webp` | compress webp (450, KD 0) | reduce webp file size; webp compressor lossless | **top-10** |
| NEW `/compress-avif` | compress avif / avif compressor | avif compressor no upload | top-20 |
| NEW `/avif-to-jpg`, `/png-to-avif`, `/jpg-to-avif` | pair terms | no-upload / batch modifiers | impressions only |
| NEW `/squoosh-alternative` | squoosh alternative | bulk squoosh; squoosh batch | **top-10** |
| NEW `/tinypng-alternative` | tinypng alternative no upload | tinypng alternative free unlimited | **top-10** |
| NEW `/blog/compress-images-without-uploading` | compress images without uploading | private image compression | top-20 |
| NEW `/benchmark/avif-vs-webp-vs-jxl` | avif vs webp file size; jxl vs avif | (link magnet, not a traffic page) | links, not rank |
| `/jxl-to-jpg`, `/jpg-to-jxl` | jpeg xl converter | — | **only if JXL decode goes free** |

---

## 3. Classic SEO items the GEO tool missed or under-weighted

### 3A. The tool is not on the landing pages (biggest miss)
Verified: every CTA on `/png-to-webp` and `/compress-webp` links to `/?to=webp#tool`; the pages are 600–700-word explainers with zero interactive element. Every page-1 competitor observed (CloudConvert, ezgif, Picflow, Cloudinary, FreeConvert, toWebP.io) has the drop-zone above the fold. For "png to webp" the intent is *do the conversion now*; a page that adds a click before the value action loses on engagement and matches Google's description of pages that act as intermediates funnelling users to one destination (Search Essentials spam policies, "doorway abuse"). Five identical templates all pointing at one tool is exactly that shape. Cloning it to 12–15 pages makes the pattern worse, not better.

**Fix (feasible today):** `App.tsx` already reads `?to=` into `initialFormat` and passes it to `<Compressor initialFormat=…>`. Mount that component into a `<div id="tool" data-to="webp">` on each static landing page (same bundle, or a tool-only entry chunk), keeping the static prose server-rendered. Result: crawlers get the HTML, users get the converter, the doorway pattern disappears, and the "evidence" H6 asks for is the working tool itself.

### 3B. Internal linking architecture
- Hub → spoke links exist only in the React footer (JS-only, footer weight). No header/nav link to the converters, no in-content "Tools" block. Pre-rendering fixes visibility; it does not fix *prominence*. Add a static "Convert / Compress" nav or a tools grid above the fold on `/` with descriptive anchors ("PNG to WebP converter").
- Spoke → spoke: good — each page links all 4 siblings with descriptive anchors plus one contextual in-copy link. Keep.
- Spoke → hub: 3–4 links per page to `/?to=…#tool`. Parameterised URLs are canonicalised, but once the tool is on-page these become plain `/` links.
- Legal links → `/privacy.html` 308 on every page (already noted). Trivial.
- No link from `/` to the future comparison/benchmark pages — plan the nav slot now.

### 3C. Title / meta CTR
- `/` title is 74 chars and lists five formats; description is 203 chars. Both truncate. Also, the title's primary ("Free Online Image Compressor") is a head term the site cannot win; pivot to the differentiator. Suggested (≤60 chars): `Compressly: Batch Image Compressor & Converter (No Upload)`.
- Landing titles omit the word most top-10 titles carry: "converter". `/png-to-webp` (66 chars) → `PNG to WebP Converter — Free, No Upload, Batch | Compressly` (59). `/compress-webp` is 70 chars → `Compress WebP — Free WebP Compressor, No Upload | Compressly` (60).
- Descriptions on landing pages are fine (150–166). Homepage: cut to ≤155 and lead with "no upload / batch / $39 one-time".
- `<meta name="keywords">` is present on every page: harmless, ignored by Google; remove to avoid looking dated to reviewers.

### 3D. Canonical / redirect hygiene
- Self-canonicals correct on all 6 pages. `http→https` 1 hop. `/index.html` and `.html` variants 308 to clean URLs — fine.
- `www` serves 200 (baseline H3) and `compressly-3wn.pages.dev` is an open, indexable mirror; both rely on canonical alone. Add the `_redirects` line for www; for pages.dev either accept canonical or gate it with Cloudflare Access (verify availability for production pages.dev before promising).
- `sitemap.xml`: drop `changefreq`/`priority` (ignored), set real `lastmod` (all six are 2026-07-24, six weeks before launch — a stale lastmod teaches Google to distrust the field).

### 3E. Core Web Vitals risk — where it actually is
No lab data (PSI 429). From the HTML:
- **The WASM bundles are not a CWV risk.** They load lazily per format inside a Web Worker after user action, so they touch neither LCP nor CLS, and INP stays on the worker. The 1.05 MB AVIF codec being `cf-cache-status: DYNAMIC` is a first-use latency/UX issue, not a Vitals issue. Do the Cache Rule anyway.
- **Real LCP risk is the homepage hero:** the LCP text cannot paint until the 108 KB br JS downloads and React mounts, and both the homepage and landing pages block on a cross-origin Google Fonts stylesheet. Pre-rendering (C1) is therefore a *CWV* fix for Google, which is a better justification than "AI crawlers". Also self-host Inter/JetBrains Mono and add `modulepreload` for the entry chunk.
- **CLS:** `display=swap` on a text-only hero → font-swap shift on headings. Self-hosting with `size-adjust` or preloading the woff2 fixes it.
- Landing pages should score well already (no JS, 6.5 KB CSS) apart from the fonts request.

### 3F. Image SEO
0 `<img>` on every page. Add per page: one 1200-px screenshot of the tool mid-batch and one before/after size comparison, WebP/AVIF, descriptive filenames (`png-to-webp-size-comparison.webp`), alt text, explicit width/height (CLS). Ship `og.png` first (currently HTML). Image-search traffic will be small; the point is E-E-A-T evidence and link-share previews.

### 3G. E-E-A-T / About / author
For tool-intent queries Google weighs this less than for YMYL, so it is Medium for rankings. It is High for two classic reasons the baseline does not connect: (1) journalists, directory editors and listicle authors will not link to an anonymous day-old domain; (2) brand-SERP ownership needs an entity. Publish `/about` with a named operator, the jSquash/Squoosh lineage, a changelog and a contact — no invented facts.

### 3H. Backlink acquisition plan for a new domain (absent from the baseline)
Goal (a goal, not a forecast): 15–30 referring domains by day 90, all earned.
- **Week 1–2, launch:** Product Hunt; Show HN ("batch AVIF/JXL compression fully in-browser, no upload"); a technical write-up on dev.to/Hashnode about multi-threaded WASM and COOP/COEP (there is demonstrated audience: DEV articles on exactly this topic rank for "wasm image compressor" queries); Indie Hackers; manual posts in r/webdev / r/SideProject (no automation).
- **Week 2–4, listings:** AlternativeTo (its Squoosh page ranks for "squoosh alternative"), SaaSHub, Slant, Uneed, BetaList, ToolFinder-type directories; relevant GitHub awesome-lists (WebAssembly / image tooling) — only where the listing is editorially reviewed.
- **Week 3–8, outreach with an asset:** publish the first-party benchmark (§4) and pitch inclusion to the publishers already ranking for "squoosh alternative" and "tinypng alternative" (compresto.app, quickimg.io, theimgapp.com, picssizer.com, pickrack.com, orthogonal.info). Ask the jSquash maintainers whether a "projects using jSquash" mention is possible.
- **Ongoing:** monitor unlinked mentions (Google Alerts / Ahrefs Alerts on "getcompressly"), convert to links.
- **Never:** paid links, PBNs, mass directory spam, reciprocal schemes — a DR-0 domain is the easiest place to get penalised.

### 3I. Search Console / Bing setup
- GSC is verified via meta tag (URL-prefix). Add a **Domain property** (DNS TXT) so www/http/pages.dev variants and future subdomains report in one place.
- Request indexing for all 6 URLs manually; new domains commonly sit in "Discovered – currently not indexed" for weeks — that, not rankings, is the first thing to watch.
- Watch GSC Pages report for: Soft 404 (will appear until `404.html` ships), "Duplicate without user-selected canonical" (www / pages.dev), "Crawled – currently not indexed" (thin-template signal).
- Bing WMT import from GSC + sitemap + IndexNow key in `public/`. Reconcile the two sub-reports' conflicting Bing index claims there.

### 3J. Crawl budget / soft-404
Crawl budget is a non-issue for a 6–15-page site; do not spend engineering time on it. The soft-404's real costs are (1) `og:image`/icons returning HTML, (2) GSC report noise, (3) Bing being more literal. One `404.html` fixes all three.

### 3K. Thin-template / doorway risk on expansion
Five pages already share one 8-section skeleton, one repeated FAQ ("Is anything uploaded?" ×5) and one repeated trust line. The 30-day plan adds 5–6 more clones. Without the tool on-page and per-page unique data (benchmark rows for that format pair), a 12-page clone set is a Helpful-Content / doorway risk, not topical authority. Rule: no new page without (a) the tool mounted, (b) a benchmark row set specific to that pair, (c) at least two PAA questions unique to that page.

### 3L. Brand SERP ownership
"compressly" queries today resolve to compressly.net/.in/.co and iOS apps. Until the apex is #1 for its own name, every PH/HN visitor who searches later is lost. Organization schema + About + 3–5 profiles linking to the apex + consistent "Compressly (getcompressly.com)" naming is the fix; measure in GSC branded-query filter.

### 3M. Schema reality for Google
Breadcrumb is the only rich-result-eligible block and it validates. FAQ/HowTo have no Google SERP value; SoftwareApplication needs real ratings to be eligible — do not fake them (the baseline is right). Treat all schema work as entity hygiene, not a ranking lever.

---

## 4. Content length: agree with the finding, disagree with the target

**Agree:** CloudConvert ranks #1 on 4/5 head terms with ~142 words at DR 82; the top-10 median is 672–911 words and Compressly is already at 0.70–0.95× of it. Adding prose will not move head-term rankings.

**Disagree with the "1,200–1,500 words per page" target** in `geo-content.md`. For tool-intent queries the lever is *tool on page + authority*; text supports. A 1,500-word explainer pushes the drop-zone below the fold and hurts the engagement the page needs. Word count should be an output of the section brief below, not an input. Expect ~500–900 words per page after the brief; if it lands there, stop.

### Per-page briefs (sections, not word counts)

**Every landing page (5 existing + new pair pages):**
1. Above the fold: H1 + 40–60-word definitional answer block ("Converting PNG to WebP re-encodes … typically 26% smaller lossless / 60–80% lossy, alpha kept. Runs locally via libwebp in WebAssembly.") + the **mounted tool preset to that pair**.
2. "How it works" 3 steps (keep; sync HowTo JSON-LD to it or drop HowTo).
3. **First-party benchmark table** for this pair: 5 named sample files (photo, screenshot, logo w/ alpha, gradient, line-art) × q60/q75/q90/lossless → before/after KB and %, encoder version, date. Measured on the tool; never invented.
4. "When NOT to convert" (e.g. PNG→WebP: pixel-art, print assets, CMYK; WebP→PNG: "will not sharpen a lossy source").
5. "Settings explained" (quality slider semantics, lossless vs lossy, effort) — unique per format.
6. Two PAA-derived H2s specific to the pair (from the list in geo-content.md: "Is WebP better quality than PNG?", "Why do my files keep saving as WebP?", etc.).
7. FAQ: 5–6 questions as H3 + `<p>` (40–80-word answers), generated from the same source as the JSON-LD.
8. One screenshot of the tool with the result + one DevTools-Network screenshot proving no upload (alt text).
9. Related tools block (keep) + author line + visible "Updated" date + `dateModified`.

**Homepage (`/`):** pre-rendered H1 aligned to the new primary ("Batch image compressor & converter — no upload"), tool, 6 features, pricing with a working checkout, all 8 FAQs in-DOM, a static tools grid linking all converter pages with descriptive anchors, About/contact in the footer as plain text.

**`/compress-webp` (the winnable head term):** everything above plus a "how much smaller at each quality" table on real WebP inputs and a lossless-mode row; target the "reduce webp file size" and "webp compressor lossless" phrasings in H2s.

**`/squoosh-alternative` and `/tinypng-alternative`:** honest comparison table (verified facts only — TinyPNG *does* support AVIF; Squoosh is single-image), what Compressly does not do, the tool mounted, link to the benchmark page.

**`/benchmark/avif-vs-webp-vs-jxl`:** methodology, dataset description, results tables, downloadable CSV, reproducible via the tool. Purpose: links and citations, not traffic.

---

## 5. Corrected fix order (top 10; top 5 in bold)

| # | Fix | Google effect | AI effect | Effort |
|---|---|---|---|---|
| **1** | **Wire the real checkout URL, rebuild, verify the live button** | none | none | 5 min — revenue |
| **2** | **Mount the tool on every landing page (preset via `initialFormat`); keep static prose** | High (intent + doorway risk) | Medium | Medium |
| **3** | **Pre-render homepage: static H1/nav/tools grid/pricing/all-8-FAQ in `#root`; FAQ always in DOM; new title/description** | Medium (indexing speed, LCP, FAQ indexed, link discovery) | High | Medium |
| **4** | **Link plan in motion: PH + Show HN + technical write-up + About page + Organization/sameAs + 3–5 owned profiles** | High (only lever for authority; brand SERP) | High | Medium, user action |
| **5** | **Breadth with unique data: `/compress-avif`, `/squoosh-alternative`, `/tinypng-alternative`, benchmark page (each with tool + benchmark rows)** | High (this is where clicks come from) | High | High |
| 6 | Week-1 hygiene bundle: `404.html`, `og.png`/icons, www 301, real `lastmod`, `/privacy` hrefs, meta-description trims, `Cache-Control` for `.wasm`, self-host fonts | Low–Medium | Medium | Low |
| 7 | GSC Domain property + request indexing; Bing WMT import + IndexNow | Medium (Bing) | High (ChatGPT/Copilot) | Low, user action |
| 8 | Copy-sync FAQ/HowTo JSON-LD; fix factual errors; Organization/@graph | Low | Medium | Low |
| 9 | Screenshots + alt text on every page; author + dates | Low–Medium | Medium | Low |
| 10 | llms.txt, security headers, Content-Signal | None | Low | Trivial — do last |

---

## 6. Honest 90-day organic expectation (estimates, not forecasts)

Reference point supplied with the task: the audit's source article saw **63 impressions / 9 clicks in 28 days** after technical fixes alone. Treat that as the month-1 baseline for "fixes without links".

| Window | What should happen | Organic clicks / month (estimate) |
|---|---|---|
| Days 0–30 | 6→10 URLs indexed (expect "Discovered – not indexed" lag); brand queries start; PH/HN referral dominates and is *not* organic | 0–30 |
| Days 31–60 | `/compress-webp` reaches page 2–3; first long-tail impressions on "no upload / batch" modifiers; comparison pages indexed | 20–80 |
| Days 61–90 | With 15–30 earned RDs and ~12 pages with tool + benchmark: `/compress-webp` page 1; `/squoosh-alternative` and `/tinypng-alternative` page 1–2; head terms png/jpg→webp at best top-50; webp→png/jpg not in top-50 | 100–300 (impressions low thousands) |

- Anything above ~500 clicks/month by day 90 requires unusual link velocity (front-page HN or a widely shared benchmark). Plan on the lower band.
- The four large head terms (webp to png/jpg, png/jpg to webp) are a 12–24-month, 100+ RD project, if reachable at all against DR 62–96 tool pages. Do not put them in a 90-day OKR.
- The metric to report in 90 days is not rank on head terms; it is: indexed URLs, referring domains, branded impressions, and clicks on the long-tail/comparison set.

---

## Evidence notes
- Head-term volumes/KD/DR/RD counts: Ahrefs via `geo-content.md` (US, 2026-09-04). Not re-pulled.
- SERP composition: US web search, 2026-09-04, 18 queries; ordering is indicative only.
- Live HTML: `compressly-3wn.pages.dev/png-to-webp` and `/compress-webp` (byte-identical mirror per baseline); homepage and landing head from local `dist/` (byte-identical per `geo-technical.md`).
- Google JS rendering: Search Central "Understand JavaScript SEO Basics" (render queue, delay "a few seconds… can take longer").
- Google on llms.txt: Search Engine Land / Search Engine Roundtable coverage of Gary Illyes (Search Central Live, Jul 2025) and John Mueller (Bluesky).
- Google doorway policy: Search Essentials spam policies ("doorway abuse").
- JXL Pro-only: `src/components/Pricing.tsx` line 19. Tool preset: `src/App.tsx` lines 13–22, 44.
- Not measured: PageSpeed Insights (HTTP 429 ×2), Google index count, Reddit/Product Hunt presence.
