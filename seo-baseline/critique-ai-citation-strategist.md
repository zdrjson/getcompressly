# Second-Opinion Critique: AI Citation Reality Check — Compressly

**Date:** 2026-09-04 · **Reviewer role:** AI Citation Strategist (AEO/GEO) · **Scope:** challenge `GEO-AUDIT-REPORT.md` (34/100; AI Citability 42, Brand Authority 2) and the four supporting agent reports from the angle "what actually earns a citation from ChatGPT, Claude, Gemini and Perplexity for a brand that launched today."
**Constraint honoured:** analysis only. Nothing under `/Users/j/Downloads/compressly` was modified except this file.

**Verification legend used throughout:** `[V]` verified by me this session · `[A]` taken from the audit, not re-verified · `[U]` unverified / could not be observed.

---

## 0. What I could and could not measure

| Evidence | Status | Detail |
|---|---|---|
| Live HTML of `/` and `/png-to-webp` | [V] | `/` = 200, 6,047 B, **0 body words**, 3 JSON-LD blocks, no `Organization`, no `sameAs`, no `<noscript>`. `/png-to-webp` = 725 body words, BreadcrumbList + HowTo + FAQPage. Audit's rendering claims hold. |
| AI citation counts per domain (Ahrefs `site-explorer-ai-responses-count`, 2026-09-04) | [V] | See §3. getcompressly.com = 0 across all platforms (expected: launched today). |
| Web-search results for 5 user-style queries | [V] | These are **search-engine** results (WebSearch), used as a proxy for what retrieval-augmented assistants would see. |
| Direct ChatGPT / Claude / Gemini / Perplexity answers | [U] | Gemini CLI on this machine fails with an auth/project-eligibility error (tried twice). No other assistant access from this sandbox. **I did not observe any AI-assistant output and none is quoted here.** |
| Name collisions | [V] for 8 of 10 | See §4. compressly.net (HTTP 521 today) and the YouTube handle were not verified by me. |

Baseline for the recheck: **0 AI citations on every platform** (Ahrefs). Any future non-zero count is measurable improvement; "citation rate" per prompt cannot be reported until the prompt set in §8 is run manually across the four assistants.

---

## 1. Reality check: which "citability" recommendations move AI citation for a new brand

Ranked by expected impact on *being cited by an AI assistant*, not by the audit tool's score. Rationale in the last column separates what is measured from what is inferred.

| # | Audit recommendation | Audit priority | My rating | Why |
|---|---|---|---|---|
| 1 | Bing Webmaster Tools + IndexNow (C4) | Critical (user action) | **GATE — do first** | ChatGPT search and Copilot are Bing-backed; Bing index = 0 [A]. No content change can matter on two of four platforms until this is done. Not a "citability" item in the audit's taxonomy, which is why it is under-weighted there. |
| 2 | Pre-render the homepage (C1) | Critical | **GATE — do first** | Confirmed 0 body words [V]. GPTBot/ClaudeBot/PerplexityBot do not execute JS; the page that defines the entity is invisible. Necessary, not sufficient. |
| 3 | Fix the two false claims + sync JSON-LD to visible text (C2, C3) | Critical | **HIGH (trust hygiene)** | Does not *earn* citations, but a false competitor claim inside structured data is the kind of thing that gets a source dropped once a model cross-checks TinyPNG's own page. Also see §6: the audit's own schema template re-ships both false statements. |
| 4 | First-party benchmark table (H6, Week 3) | High, scheduled week 3 | **HIGHEST content lever — move to week 1** | The only thing on the site an LLM cannot get from Google's WebP docs or from Cloudinary. Evidence: compressimage.io (16 cited pages, 106 citations, 32 on Perplexity) is a small in-browser compressor whose citable asset is a dated, methodology-bearing comparison post [V]. Full spec in §5. |
| 5 | Organization schema + `sameAs` + `/about` (H4, H5) | High | **MEDIUM — entity plumbing, only works once profiles exist** | Schema does not attract citations; it helps a model that has *already* found you resolve which "Compressly" you are. Zero measured effect on its own. Use `disambiguatingDescription` (real schema.org property), which the audit does not mention. See §4. |
| 6 | Definition / direct-answer block under each H1 | High (H6) | **MEDIUM, cheap** | Answer-shaped openings are what AI Overviews and Perplexity lift; keep it. But at DR 0 it competes with FreeConvert/CloudConvert answer blocks on the same query, so it is a formatting prerequisite, not a lever. The audit's "definition patterns roughly double citation rates" is unsourced [U]; treat as heuristic. |
| 7 | Query-shaped H2s from PAA (content #4) | High | **MEDIUM** | Reasonable, and free. Prioritise the intents that actually surfaced (§3): "no upload", "batch/bulk", "Squoosh alternative" — none of the 5 landing pages targets any of them. |
| 8 | FAQ answers 40–80 words; FAQ as `<h3>` not `<details>` | High | **LOW — reframe** | Short factual answers are quoted fine by LLMs; length is not the problem. What matters is that each answer is *self-contained*: names the entity ("Compressly"), carries a number, and stands without the question. `<details>` content is in the DOM and is read; the H3 swap is cosmetic. FAQ rich results have been dead for non-gov/health sites since Aug 2023 [A]. |
| 9 | Passages in the 134–167-word band | Called out in 3 reports | **LOW — checklist theater** | Provenance of this band is not given anywhere in the audit and I cannot verify it [U]. Citation studies show assistants quote sentence- to paragraph-length spans of wildly varying length; no platform has published a word-count preference. Do not spend a single hour trimming "Why…" intros from 178 to 160 words. |
| 10 | `llms.txt` (H2) | High | **LOW for citation; ship anyway (10 minutes)** | Evidence found today [V, secondary sources]: Google stated in July 2025 it does not use it; OpenAI's crawler docs do not mention it; an Ahrefs study of 137k domains found 97% of llms.txt files received zero requests in May 2026; 408 direct fetches in 500M monitored AI-bot visits. It is read by IDE agents (Cursor, Claude Code), not by answer engines. The *real* fix in that item is the soft-404: today `/llms.txt` returns HTML with 200, which is worse than absent. |
| 11 | Word count to 1,200–1,500 per page | Content #4, Week 3 | **LOW** | The content agent itself proved length is not the lever (CloudConvert ranks #1 with ~140 words at DR 82) and then still set a word target. Add words only as benchmark rows, PAA answers and screenshots — never as prose. |
| 12 | `speakable`, `Content-Signal`, HowTo schema, `featureList` | Medium/Low | **LOW** | `speakable` has near-zero consumer adoption; `Content-Signal` is an opt-out signal, not a citation lever; HowTo rich results were removed Sep 2023 (sync it or delete it — mismatched is the worst state). `featureList` is cheap and lives in the head where non-JS crawlers see it; fine to add, expect nothing measurable. |
| 13 | Breadth pages (`/compress-png`, `/png-to-avif` …) (M1, Week 4) | Medium | **MEDIUM long-term, wrong for week 1** | Breadth *is* how converter sites win citations: FreeConvert has 3,379 cited pages, CloudConvert 708 [V]. But those citations are DR-gated; five more DR-0 template clones will not be cited in September. Build after the benchmark exists so each new page carries unique numbers. |
| 14 | Security headers, www redirect, wasm caching, 404.html | High/Medium | **Hygiene** | Zero citation impact except `404.html`, which stops the site lying to every fetcher. Do them; do not count them as GEO progress. |

**Net correction to the audit's thesis.** The report says fix order is render → schema/facts → evidence+entity → breadth. For AI citation specifically it is: *index gate (Bing) + render* → *truth pass* → *one unique evidence asset* → *entity anchors as real profiles go live* → *query-shaped pages for the intents that surfaced* → breadth. Schema drops from tier 2 to a supporting role inside the entity step.

---

## 2. What earns citations in this category (measured)

Ahrefs AI-citation index, 2026-09-04, `mode=subdomains` (relative counts within Ahrefs' tracked prompt sample; treat as ranking, not absolute truth):

| Domain | All platforms (citations / pages) | ChatGPT | Google AIO | Gemini | Perplexity | Copilot | What carries it |
|---|---|---|---|---|---|---|---|
| freeconvert.com | 31,648 / 3,379 | 243 | 1,187 | 499 | 2,169 | 26 | Thousands of one-intent tool pages (breadth) + DR |
| cloudconvert.com | 12,932 / 708 | 236 | 233 | 142 | 567 | 21 | Same pattern; ~140 words/page, DR 82 |
| tinypng.com | 629 / 37 | 82 | 63 | 28 | 51 | 17 | Brand entity; appears in every third-party listicle |
| squoosh.app | 181 / 2 | 28 | 14 | 11 | 2 | 0 | **Two pages.** Pure entity strength (Google Chrome Labs, GitHub) |
| compressimage.io | 106 / 16 | 7 | 6 | 6 | 32 | 8 | Small in-browser compressor with a dated, methodology-bearing comparison post → Perplexity-heavy |
| squish.addy.ie | 1 / 1 | 0 | 0 | 0 | 0 | 0 | 1.0k GitHub stars, known author, batch + AVIF/JXL/WebP — and **one citation**. Stars are not citations; the site has no citable text. |
| compresseasy.com | 0 / 0 | 0 | 0 | 0 | 0 | 0 | The site Compressly's README says it replicates. Same template, zero citations. |
| getcompressly.com | 0 / 0 | 0 | 0 | 0 | 0 | 0 | Baseline |

Three lessons that the audit's checklist does not capture:
1. **Squish is the cautionary tale for Compressly.** Near-identical feature set (browser, batch, MozJPEG/OxiPNG/WebP/AVIF/JXL), stronger author entity, and it is essentially uncited because it publishes no facts. Feature parity earns nothing.
2. **compresseasy.com is the second cautionary tale.** Compressly is a replica of it (README [V]); it has zero citations. The template you cloned has already been shown not to get cited.
3. **compressimage.io is the model.** Similar size and DR class to what Compressly can reach in 90 days; its citations come disproportionately from Perplexity, which rewards first-party, dated, numeric content.

---

## 3. Competitor citation gap — 5 queries as a user would ask an assistant

Method: WebSearch (search-engine results, US), 2026-09-04. This is a proxy for retrieval, not an observed assistant answer [U for assistant behaviour].

| Query | Who surfaced (top results) | Why they win (observable) | What Compressly lacks |
|---|---|---|---|
| "best free image compressor that doesn't upload my files" | compressimage.io (+ its own listicle), Squoosh, BulkPicTools (listicle), ImgSmaller, FileSlim, FastCompressor | Query-phrased titles ("No Upload"), **listicles with numbers** ("cut JPEGs by 61% and PNGs by 68%"), explicit "works offline" claims | "no upload" is absent from the homepage H1/title; no numbers; no listicle mentions anywhere |
| "png to webp converter no upload" | ImageKit, Gumlet, Picflow, ToWebP.io, AnyWebP, FreeImageTools, TinyImagePro | Exact-match title "PNG to WebP Converter — Free Online, No Upload"; bulk claims; established DR | `/png-to-webp` title has "Private, In Your Browser" — good, but not the literal phrase users type; page not indexed by Bing |
| "batch compress images in browser" | Squish, Chrome extension, imagecompressor.com, CompressPixel, compress-images.com, bulkimagecompressor.com | Dedicated batch/bulk pages with explicit limits ("up to 100 images", "1,000+ images") | **No batch/bulk page exists.** Batch + ZIP is Compressly's core differentiator and has no URL. |
| "compress images locally in browser without uploading privacy" | FileVert, TinyToolsHub, OfflineCompress, LessMB (blog), BrowserCompress, BulkPicTools | Privacy-framed pages; blog posts that teach the DevTools-Network-tab verification | Compressly has the verification claim in prose but no screenshot, no page, no post |
| "Squoosh alternative batch processing multiple images" | compresto, Bulk Squoosh, BulkImagePro, PicsSizer, FastCompressor, theimgapp, Zipic, imgkonvert, **alternativeto.net** | "Squoosh alternatives" pages — at least 8 sites own this intent; AlternativeTo listing pages rank | No "vs/alternative" page; not listed on AlternativeTo; the FAQ line about Squoosh is one sentence inside a JS-rendered accordion |

Cross-cutting: Compressly did not surface for any query, and neither did compresseasy.com. The intent cluster Compressly is *built* for ("no upload" + "batch" + "Squoosh alternative") is already crowded with 15+ small sites making the identical claim. Differentiation on claims is exhausted; differentiation on **evidence** (§5) is open — none of the tool sites publish a reproducible benchmark; only listicle/blog sites do.

---

## 4. Entity collision — verified inventory and disambiguation plan

### 4.1 Inventory

| Colliding entity | Status | What it is | Overlap with Compressly's claims |
|---|---|---|---|
| compressly.co → www.compressly.co | [V] live, 200 | "Compressly – Private AI Image Compressor \| Reduce File Sizes by up to 90%"; "All processing happens in your browser — no data sent to servers" | **Near-total**: same name, same privacy/in-browser pitch |
| compressly.in | [V] live | "Compressly – Image Tools for Compression, Resizing & Uploads" | Same name, same category |
| compressly.net | [U] HTTP 521 today (origin down) | Per audit: browser-based image compressor | Same name, same category (when up) |
| github.com/compressly (org) | [V] exists | Repo `compressly.github.io` — "The website for Compressly", updated 2026-07-13 | **Not in the audit.** Takes the clean GitHub org name |
| github.com/asaumet230/compressly | [V] | Next.js in-browser image compressor, MIT, 1 star, live demo on andressaumet.com | Same name, in-browser, ZIP download |
| App Store "Compressly: Image Size Pro" (id6502885386) | [V] via search listing | iOS compressor: batch, 100% offline, JPEG/HEIF/AVIF/WebP/**JPEG XL** | **Claims batch + offline + JXL** — the exact differentiator triad |
| Google Play "Compressly – Image Compressor" (com.tools.compressly) | [V] | Android: JPG/PNG/WebP, batch, "works 100% offline" | **Not in the audit.** Same triad minus JXL |
| Product Hunt "Compressly: Quick Online Image Compresser" | [V] | Chrome extension by Vinit Patil, 2020 listing, 5 upvotes | Occupies the PH slug `/products/compressly` |
| youtube.com/@compressly | [A] | Music channel | Handle taken |
| GetCompress (getcompress.com, PH July 2026) | [V] | Desktop media compressor (Rust), solo founder | "getcompressly" fuzzy-matches "getcompress" |

github.com/getcompressly → 404 [V] — **available**. X handle `@getcompressly` [U].

**Severity call.** This is not a "some unrelated apps share the name" situation. At least six same-category products — two of them mobile apps whose store copy makes the same batch/offline/JXL claims — resolve on the token "Compressly". An LLM asked "is Compressly private / does it do batch / does it do JXL" will find those facts attributed to the iOS app, and attribute-based disambiguation (the usual fix) is weakened because the attributes collide too.

**Decision the operator must make this week (either/or, so I am flagging rather than deciding):**
- **(A) Rename now.** Cost today: a day of find-and-replace and a new domain; brand equity to lose: none (launched today, 0 mentions). Every week of delay raises the cost.
- **(B) Keep the name and run the disambiguation plan below** — a multi-month tax paid on every page, profile and mention, with no guarantee the models stop conflating.
My recommendation is (A) unless there is a reason outside this audit to keep the name. The plan below is for (B) and also applies, in simplified form, to whatever name is chosen.

### 4.2 Disambiguation plan (ordered)

1. **Fix the entity string before anything else (day 1).** Adopt one canonical form and use it in the first sentence of every page, the `<title>` suffix, the meta description, the Organization/SoftwareApplication `name`/`alternateName`, and every off-site profile bio: **"Compressly (getcompressly.com)"**, with the three differentiators always co-occurring in the same sentence: *WebAssembly in the browser · batch + ZIP · $39 one-time Pro*. No colliding product has all three of those plus the domain. Put the "not to be confused with" hatnote **only on `/about`** — never on every page, or you teach the models the co-occurrence you are trying to break.

2. **Claim the profiles that are free, in this order, and only these (week 1–2):**
   1. **GitHub org `getcompressly`** [V free] — public repo containing the benchmark corpus, scripts and CSV (§5). GitHub is in every LLM's training and retrieval set and is the natural home for a WASM tool. Add `sameAs` the day it is public.
   2. **Product Hunt** — launch as "Compressly (getcompressly.com)" (the bare slug is taken). PH pages are heavily cited for tool queries.
   3. **AlternativeTo** — list as an alternative to Squoosh and TinyPNG. `alternativeto.net` ranked for the "Squoosh alternative" query [V]; it is the cheapest way to appear on the intent you care about.
   4. **X `@getcompressly`** [U availability] — bio = canonical string; pinned post = benchmark.
   5. **YouTube `@getcompressly`** — one 60–90 s screen recording per landing page. YouTube is a top-cited domain for Gemini and picked up share on Perplexity after Reddit citations collapsed in late 2025 [V, secondary].
   6. **LinkedIn company page — only if a real legal entity exists.** Do not create a page for an entity that does not.
   7. **Wikidata — not yet.** The audit suggests creating an item now; items with no independent references are routinely deleted. Create it after PH + at least one independent third-party mention exist.

3. **Organization node with the property the audit missed (week 2, in the static `<head>`).**
   - `Organization` `@id …/#organization`, `name` "Compressly", `alternateName` ["getcompressly", "Compressly (getcompressly.com)"], `url`, `logo` (after the asset exists), `email`.
   - **`disambiguatingDescription`** (schema.org, valid on Thing): "Browser-based image compressor and converter at getcompressly.com, built on jSquash/Squoosh WebAssembly codecs. Not affiliated with the iOS, Android or Chrome-extension products named Compressly, or with compressly.co/.in/.net."
   - `sameAs`: **only URLs that return 200 today**, added one at a time as each goes live. An empty array beats a dead link.
   - `SoftwareApplication` `@id …/#software` with `publisher`/`author` → `#organization`, `alternateName`, `featureList` (cheap, already true), `isAccessibleForFree: true`.
   - Landing pages: `WebPage.about → #software`, `isPartOf → #website`.

4. **A real `/about` (week 2).** Static HTML like the landing pages, containing: the canonical string, what it is built on (jSquash / Squoosh codec family — true per README), the hatnote, the contact email in plain text, a changelog with dates. **Who builds it must be supplied by the operator**; nothing in `src/`, `public/`, `index.html` or `package.json` names a person or company [V]. If the operator does not want to disclose identity, say "an independent developer" and stop there.

5. **Seed the first independent mentions where citation-weighted platforms will see them (week 3–4).** Show HN with the benchmark as the hook (not the product), the PH launch, and *manual* replies in existing r/webdev / r/web_design threads about private compression — no automation (standing rule).

### 4.3 What NOT to do

- No `sameAs` to profiles that do not exist yet, to Wikipedia, or to the *other* Compressly's GitHub/YouTube/PH pages.
- No `aggregateRating`/`review` until third-party-verifiable reviews exist (audit is correct; keep it).
- Do not name the colliding products on every page (co-occurrence pollution). `/about` only.
- Do not try to claim `@compressly` anywhere — every variant of it is someone else's; use `getcompressly` consistently.
- Do not create a Crunchbase/LinkedIn entity for a company that has not been formed.
- Do not automate Reddit or Product Hunt.

---

## 5. The single most citable asset for week 1

**Asset:** *Compressly Image Compression Benchmark — September 2026* (a first-party, reproducible measurement of Compressly's own encoders on a fixed, redistributable corpus).

**Why this beats more landing pages.** Every landing page states facts any competitor can state ("25–35% smaller"). An LLM has no reason to attribute a generic fact to a DR-0 domain over Cloudinary. A benchmark is the one page whose numbers exist *only* on getcompressly.com; it is exactly the artefact behind compressimage.io's 106 citations and behind the sammapix/lowqualityimage posts that surface for comparison queries [V]. It also supplies real numbers to replace the unsourced ranges on all five landing pages, and it is the hook for Show HN and the GitHub repo.

**Format specification (publish all three):**

1. **HTML page `/benchmark`** (static, same build as the landing pages, in the sitemap):
   - Direct-answer paragraph under the H1 with the three headline numbers (median reduction per format at q75; lossless PNG→WebP; encode time per MB).
   - **Methodology** block: corpus, encoder names and versions (from jSquash's `package.json` — MozJPEG, OxiPNG, libwebp, libavif, libjxl), quality settings tested (60 / 75 / 90 + lossless where applicable), hardware, browser, date, and the quality metric used (SSIMULACRA2 or DSSIM, computed offline with a named tool; if no metric is computed, say "size only").
   - **One sortable table**, one row per file × setting: file, category, source format, bytes in, bytes out, % reduction, encode ms, quality score. Every number is a measurement.
   - Per-category summary sentence with the median (these are the citable sentences).
   - Visible "Published / Updated" dates; `dateModified` in schema; author line = the operator's real chosen identity (see §4.2 step 4).
2. **GitHub repo `getcompressly/benchmark`**: the corpus (or a script that fetches it), the run script, `results.csv`, and the exact encoder versions. Reproducibility is what makes it citable *and* what disambiguates the entity.
3. **A reusable 5-row "headline table"** (one per landing page's format pair) embedded on each landing page with a link to `/benchmark` — this is how the evidence lifts the existing pages without adding prose.

**Corpus (avoid fabrication and licensing traps):** ~30 files across 6 categories × 5: photograph, UI screenshot, logo with alpha, illustration, text-heavy image, gradient. Use files you can redistribute: your own screenshots plus a standard public set (e.g. the Kodak PhotoCD test images, widely used in codec research) or CC0 images with the source URL recorded per file. Never use files you cannot publish.

**Fabrication guard for this asset:** no number leaves the CSV without a run behind it; do not benchmark competitors unless you actually run their tools, screenshot the result and date it; do not put "500 images" in a title (the platform agent's suggested title) unless 500 were run.

---

## 6. Fabrication risks inside the audit's own recommendations

The operator has a strict no-fabrication rule. These items would create *new* false statements if implemented as written:

| Where | Risk | Fix |
|---|---|---|
| `geo-schema.md` template A, FAQ answers 1 and 5 | Copies the homepage FAQ **verbatim, including the two errors** C2 identifies: "Google's MozJPEG" and "TinyPNG … only supports JPG/PNG/WebP". Implementing the template as-is re-ships both falsehoods inside structured data. | Correct the text in `FAQ.tsx` first, then generate the JSON-LD from that array. |
| `geo-ai-visibility.md` llms.txt draft, "Versus alternatives" line | Repeats "TinyPNG (server upload, JPG/PNG/WebP only)". TinyPNG supports AVIF [A, from content agent]. | Rewrite as "TinyPNG uploads to a server; Squoosh processes one image at a time" — both verifiable — and drop the format claim. |
| llms.txt draft, `[FILL]` fields (founder, location) | Correctly left blank, but they are an invitation to fill. "Website launched: September 2026" is operator-declared, fine. | Remove the fields entirely rather than leave `[FILL]`. |
| Content agent #4: "author byline on every landing page" | No author exists anywhere in the source [V]. A byline invented for E-E-A-T is a fabricated person. | Byline only if the operator names a real person; otherwise a dated "Compressly team" line with the `/about` link. |
| Platform agent: "/about stating who builds it" | Same — identity must come from the operator, not from an agent writing copy. | Operator supplies; agent formats. |
| Week 4: "Compressly vs TinyPNG vs Squoosh" page | Competitor facts written from memory drift (the TinyPNG error is the proof). | Every competitor claim verified on the competitor's live page, with a "checked on <date>" note; re-verify quarterly. |
| README: "Replica of CompressEasy" | Any origin story claiming original invention or "our own codecs" would be false. | About page says "built on jSquash (Squoosh's WebAssembly codecs)" and nothing grander. |
| Expected-impact figures ("+15–20% citation rate", "citability 42 → ~52") | These are tool-score projections and estimates, not measurements. | Label as estimates in anything client-facing; report only Ahrefs counts and the manual prompt-set results as outcomes. |
| Testimonials / ratings | Correctly excluded by all agents. | Keep excluded; PH/AlternativeTo reviews must be organic. |

---

## 7. Corrected top-5 fix order for AI citation specifically

1. **Open the gate (week 1, config + code):** Bing Webmaster Tools via GSC import + sitemap + IndexNow key file; pre-render the homepage with all 8 FAQ answers in the DOM; `404.html` so `/llms.txt` and `/og.png` stop returning HTML. Nothing downstream is visible to ChatGPT/Copilot/Perplexity until this is done.
2. **Truth pass (week 1, copy):** fix MozJPEG/TinyPNG/browser-encoder/JXL statements in the visible text, the JSON-LD, and the llms.txt draft; make FAQ/HowTo schema identical to visible text (or delete HowTo); set `VITE_LS_CHECKOUT_URL` — an AI-referred buyer hitting a dead $39 link is the worst possible first impression.
3. **Publish the benchmark (`/benchmark` + GitHub repo) (week 1–2):** the only unique, first-party, dated, numeric asset; feeds every landing page's headline table and every launch post.
4. **Anchor the entity as profiles go live (week 2–3):** GitHub org → Product Hunt → AlternativeTo → YouTube; Organization node with `disambiguatingDescription` + `alternateName` + progressive `sameAs`; static `/about` with operator-supplied identity. (Or rename — see §4.1.)
5. **Query-shaped pages for the intents that actually surfaced (week 3–4):** `/bulk-image-compressor` (batch + no-upload, with limits stated), `/squoosh-alternative` (dated, verified, honest), and "no upload" added to the homepage H1/title. Format-breadth pages come after, each carrying its own benchmark rows.

Everything else in the audit (llms.txt, speakable, security headers, 134–167-word trimming, FAQ H3 swap, word-count targets) is either hygiene or theater — do the ten-minute ones, skip the rest until the five above are done.

---

## 8. Recheck protocol (so the "before" exists)

- **Baseline recorded today:** Ahrefs AI citations = 0 on all platforms for getcompressly.com; competitor counts in §2.
- **Manual prompt set** (run in ChatGPT with search, Claude, Gemini, Perplexity; record which brands are named and which URLs are cited; results are point-in-time and non-deterministic — run each prompt twice):
  1. "Best free image compressor that doesn't upload my files"
  2. "PNG to WebP converter that works offline in the browser"
  3. "Batch compress 100 images in the browser and download as ZIP"
  4. "Squoosh alternative with batch processing"
  5. "Is Compressly safe — does it upload my images?"
  6. "What is Compressly (getcompressly.com)?"
  7. "Free tool to convert images to AVIF or JPEG XL without uploading"
  8. "TinyPNG alternative that keeps files private"
- **Recheck at day 14 and day 30:** re-run the eight prompts, re-pull Ahrefs `site-explorer-ai-responses-count` for getcompressly.com, compressimage.io and squoosh.app. Success is any non-zero citation on ≥2 platforms and correct entity attribution on prompts 5–6.

---

### Evidence files
Live fetches saved in `/private/tmp/claude-501/-Users-j/ff2480b3-8681-461f-95b9-b48d3fd6740d/scratchpad/critique/` (`live_home.html`, `live_png-to-webp.html`, Gemini CLI error logs). No AI-assistant output was captured.
