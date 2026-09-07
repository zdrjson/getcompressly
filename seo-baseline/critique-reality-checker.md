# Reality-Checker Critique of the GEO Baseline — getcompressly.com

**Reviewer:** TestingRealityChecker (integration / reality-check agent)
**Date:** 2026-09-04
**Subject:** `GEO-AUDIT-REPORT.md` (34/100) and its five sub-reports
**Stance:** Default NEEDS WORK. Every CRITICAL/HIGH finding was re-tested with my own fetches, source reads, bundle inspection, Ahrefs calls and a Chromium render of the byte-identical `dist/` build. Nothing under `src/`, `public/`, `index.html`, `dist/` or `deploy` was modified.

**Bottom line:** the audit's factual core is sound — 11 of 13 CRITICAL/HIGH findings reproduce exactly. Its severity ladder does not: three findings are overstated, one is partly unverifiable, one rests on a false evidentiary claim ("no referring domains"), the sub-reports contradict each other in five places that the synthesis silently resolved, and the package missed two things a skeptical integrator would have caught first (a 258-domain spam link cluster already attached to the domain, and false "works offline / PWA-ready" product claims on the homepage that the audit's own schema template and llms.txt draft would propagate).

---

## 1. Evidence I generated (independent of the audit)

| Evidence | Result |
|---|---|
| Raw fetch `/` (curl, `--retry 3`) | 200, 6,047 B, body = `<div id="root"></div>`, 0 `<a>`, 0 `<h1>`, 0 `<noscript>`; sha256 `d7c72d795577…` identical to local `dist/index.html` |
| Raw fetch of the 5 landing pages | 200 each; sha256 identical to `dist/*.html` (live == local, so source-level checks are valid) |
| Live bundle `/assets/index-0CeCobE2.js` | 346,903 B, sha256 `7ed3d69289775411…` identical to `dist/`; contains `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` (1 hit) and `https://api.lemonsqueezy.com/v1/licenses` (1 hit); zero GA/GTM/Plausible/PostHog/Sentry strings |
| Placeholder checkout URL | `https://your-store.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID` → HTTP 404 |
| Chromium render of `dist/` served locally | 587 words; H1 "Compress images 10× smaller without losing what matters."; 3 H2; 7 internal links (5 landing + `/privacy.html` + `/terms.html`); only external link = placeholder checkout; `#faq` has 8 question buttons and **1** answer in the DOM; no `<link rel=manifest>`; 0 service-worker registrations |
| Crawler UA fetches of `/` (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, bingbot) | all 200, all the same 6,047 B shell |
| Soft-404 probes | `/og.png /favicon.ico /apple-touch-icon.png /llms.txt /about /this-is-not-a-page-xyz /BingSiteAuth.xml /.well-known/indexnow-key.txt /404.html /manifest.json /manifest.webmanifest /sw.js` → **all 200 `text/html` 6,047 B**. `/favicon.svg` → 200 `image/svg+xml` 353 B (the only image asset that exists) |
| Hosts | `http://getcompressly.com/` → 301 https; `https://www.getcompressly.com/` → **200, 6,047 B, no redirect**; `https://www.getcompressly.com/png-to-webp` → 200; `compressly-3wn.pages.dev` → 200; no `public/_redirects` exists |
| Response headers | present: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy: interest-cohort=()`, COOP `same-origin`, COEP `require-corp`; **absent: HSTS, CSP, X-Frame-Options**. `/assets/*.wasm` → `cf-cache-status: DYNAMIC`; `/assets/*.js` → `HIT` |
| Cloudflare edge injection (browser `Accept` header) | `static.cloudflareinsights.com/beacon.min.js` injected on `/`; privacy page email is CF-obfuscated (`data-cfemail`, `[email protected]`) for **browser, curl and GPTBot UAs alike** |
| `/privacy.html` (no `-L`) | 308 → `/privacy` |
| Schema ↔ visible text (my own parser, 5 pages) | FAQ questions verbatim **3/20**, FAQ answers verbatim **0/20**, HowTo steps verbatim **0/15**; breadcrumb visible = "Home", schema item 1 = "Compressly" |
| Landing-page counts (5 pages) | `<img>` 0, external `<a>` 0, date strings 0, author 0, `privacy.html` hrefs 1 each, all 5 sibling links present on every page |
| Copy overreach | `/png-to-webp`: "…the same MozJPEG, libwebp and libavif projects the browsers themselves use…"; `/webp-to-png`: "…the same libwebp and OxiPNG projects the browsers rely on…" |
| TinyPNG live | `og:title` = "TinyPNG – Compress AVIF, WebP, PNG and JPEG images"; 115 occurrences of "avif" on the homepage |
| RDAP `getcompressly.com` | registration **2026-07-24T13:08:16Z** (6 weeks old, not "today") |
| Bing | `site:getcompressly.com` → "There are no results for…" and **0 result links** to the domain; `"getcompressly.com"` → 0 result links. DuckDuckGo returned 202 (bot challenge) — not testable |
| Ahrefs | DR **0.0**; backlinks-stats: **263 live backlinks / 258 live referring domains** (all-time 373 / 367); top-25 referring domains are all link-spam (`prime-high-da-seoexpress.store`, `seoexpress-white-hat-group.store`, `official-anchor-text-seoexpress-system.store`, `high-quality-backlinks.site`, `linkbooster.website`, `rglinks.org`…), **0 dofollow**, first seen 2026-07-28 → 2026-08-17 |
| iTunes Search API `compressly` | "Compressly: Image Size Pro" (Leyton Nguyen), "Compressly – Streamline" (huang li), "Compressly" (TRAN VAN MANH), plus "PDF Compressly" and "Compressly: Video Compressor" |
| `youtube.com/@compressly` | title "Elvis Compressly - YouTube" |
| `compressly.in` | 200, "Compressly - Image Tools for Compression, Resizing & Uploads"; `compressly.co` 200; `compressly.net` 521 (origin down) |
| Homepage meta | title 74 chars; description 203 chars; `google-site-verification` present; no `msvalidate.01` |
| Source | `FAQ.tsx:56` `{open === i && (…)}` conditional render; `Pricing.tsx:5` placeholder fallback; `Footer.tsx` is the only place the 5 landing links exist (`Header.tsx` has `#` anchors only); `engine.ts:7` worker pool capped at `min(4, cores-1)`; `worker.ts` lazy-`import()`s every codec on first use; no `react-router`, no service worker, no manifest anywhere in `src/`/`public/`/`index.html` |

---

## 2. Verdict table — CRITICAL and HIGH findings

Legend: **CONFIRMED** = fact and severity reproduce · **OVERSTATED** = fact reproduces, severity/consequence does not · **FALSE POSITIVE** = fact does not reproduce · **UNVERIFIABLE** = cannot be tested from outside

| ID | Audit claim | Verdict | My evidence | Corrected severity |
|---|---|---|---|---|
| **C1** | Homepage 100 % client-rendered; 0 words/0 links/no H1 raw; ~587 rendered; 7/8 FAQ answers never in DOM; landing links only in footer | **CONFIRMED** | Raw body `<div id="root"></div>`, 0 `<a>`, 0 `<h1>`, 0 `<noscript>`; all five AI/Bing UAs get the same shell; render = 587 words, 1 of 8 FAQ answers in DOM (`FAQ.tsx:56`); links only in `Footer.tsx` | **CRITICAL** (stands) |
| **C2** | Factual errors: "Google's MozJPEG", "TinyPNG only JPG/PNG/WebP", browser-encoder overreach, JXL > AVIF as fact | **CONFIRMED** | Strings present in `index.html` JSON-LD (line 68, 88, 93), `FAQ.tsx`, live bundle and rendered DOM; TinyPNG's own og:title lists AVIF; both landing-page overreach sentences found verbatim | **CRITICAL** (stands — it is in structured data that non-JS crawlers *do* read) |
| **C3** | FAQ/HowTo JSON-LD ≠ visible text on all 5 pages; "risk manual action" | **CONFIRMED (fact) / OVERSTATED (severity)** | My parser: Q 3/20, A 0/20, steps 0/15 — identical numbers. But every mismatch is paraphrase of the same facts; FAQ rich results are gov/health-only and HowTo rich results were removed in 2023, so there is no rich result to lose; the only real policy exposure is the schema-only questions with no visible counterpart (e.g. 2 of 4 on `/png-to-webp`). The AI-visibility sub-report itself calls this a "minor consistency issue"; the synthesis promoted it to CRITICAL without new evidence | **HIGH** — still do it (20-minute static-HTML copy job), but it is not a launch blocker |
| **C4** | Zero Bing index; no Bing WMT; no IndexNow | **CONFIRMED (index) / UNVERIFIABLE (WMT)** | Bing `site:` and quoted-domain queries → 0 result links. But (a) the AI-visibility sub-report says the opposite ("own domain indexed", "about 440 results") — it misread Bing's fallback result counter (I saw "72,600 results" on the same no-results page); (b) "no BWT" is inferred from a missing `msvalidate.01` meta — GSC-import verification leaves no on-page trace, so BWT status is unknowable from outside; (c) absence from Bing 6 weeks after registration with zero real links is normal lag, not a defect | **HIGH** (user action, 10 min). Keep the fix, drop the "black-out" drama |
| **C5** | "Get Pro — $39" links to a build placeholder → 404 | **CONFIRMED** | Live bundle == dist (sha256), contains placeholder; rendered button href = placeholder; URL → 404; `Pricing.tsx:5` | **CRITICAL** — correctly kept outside the GEO score; it is the single highest-value fix on the list |
| **H1** | Soft-404 on every unknown path; safe to add `404.html` | **CONFIRMED** | 12 probes → 200 `text/html` 6,047 B; no router dep; `App.tsx` uses only `?to=` + `#tool`. Note: the "index bloat — Bing estimates 440 results" supporting argument is **false** (Bing has 0); H1 stands without it | **HIGH** (stands) |
| **H2** | No `llms.txt` | **CONFIRMED / OVERSTATED** | 200 `text/html` shell. But no major AI engine has confirmed consuming llms.txt; expected lift is speculative | **MEDIUM** — 15 minutes, do it, don't count on it |
| **H3** | `www` is a live duplicate host | **CONFIRMED / OVERSTATED** | 200 on `/` and `/png-to-webp`, no redirect, no `_redirects`. But every page self-canonicalises to the apex and there are zero real inbound links to split — no measurable harm today | **MEDIUM** — one line, do it, not "HIGH" |
| **H4** | Brand collision + zero mentions; DR 0; "domain registered today"; "no referring domains" | **CONFIRMED (collision) / FALSE on two evidentiary claims** | Collision is real and *worse* than reported (5 App Store "Compressly" apps, YouTube handle, compressly.in/.co live). DR 0.0 confirmed. **But:** RDAP registration is 2026-07-24 (6 weeks, not "today" — the main report contradicts its own sub-report), and "no referring domains / no backlinks" is wrong: Ahrefs shows **258 referring domains**, all spam (see N1) | **HIGH** for the entity problem; the score (2/100) is a fair reading of off-site reality and no code changes it |
| **H5** | No Organization/@id/sameAs; thin SoftwareApplication | **CONFIRMED** | `index.html` lines 37–59: SoftwareApplication has name/category/OS/url/description/2 Offers only; WebSite has name/url only | **HIGH** (stands) |
| **H6** | Landing pages: no evidence, images, citations, author, dates; unsourced % figures | **CONFIRMED** | 0 `<img>`, 0 external links, 0 dates, 0 author on all 5; identical skeleton | **HIGH** (stands) — but see §5 on *how much* content work is warranted this week |
| **H7** | Missing HSTS/CSP/X-Frame-Options | **CONFIRMED / OVERSTATED for GEO** | Headers absent. Zero effect on crawling or citation; and the CSP recommendation is a breakage risk on a WASM + Web-Worker + Google-Fonts + Cloudflare-injected-script site | **MEDIUM** — HSTS + `X-Frame-Options`/`frame-ancestors` are 2 safe lines; ship any CSP as `Report-Only` first |
| **H8** | `og.png`, `favicon.ico`, `apple-touch-icon.png`, logo do not exist | **CONFIRMED** | `public/` has only `favicon.svg`; all three URLs return HTML; `og:image` on all 6 pages points at HTML | **HIGH** (stands) — breaks every link preview, including AI answer cards |

Medium items I verified in passing (all **CONFIRMED**): M2 Cloudflare beacon injected vs privacy text "does not run any third-party analytics"; M3 description 203 chars; M5 `.wasm` `DYNAMIC`; M6 `/privacy.html` 308; M7 email obfuscated for **all** UAs including GPTBot (worse than "hidden from some crawlers" — no non-JS reader can get the address anywhere on the site).

**Tally:** 13 C/H findings → 11 reproduce on the facts; 4 have overstated severity (C3, H2, H3, H7); 2 carry false or unverifiable supporting evidence (C4, H4). 0 outright false positives.

---

## 3. What the audit missed (new findings)

**N1. A 258-domain spam link cluster is already attached to the domain — and two sub-reports asserted "no backlinks".**
Ahrefs: 263 live backlinks from 258 referring domains, DR 0.0, top-25 all SEO-spam vendors (`*-seoexpress-*.store`, `high-quality-backlinks.site`, `linkbooster.website`, `rglinks.org`…), 0 dofollow, first seen 2026-07-28 — four days after registration. This is the same SEOExpress cluster that polluted harlowe.com (disavowed 2026-08-21). Consequence: any "referring domains" KPI in a future before/after comparison is already poisoned; the technical and platform reports' "no referring domains" is wrong. Action: none urgent (all nofollow; Google says it ignores this), but record the baseline now, re-check monthly, and do not let anyone read "258 refdomains" as growth. Not a code fix.

**N2. Two false product claims on the homepage: "Works offline once loaded" (Hero) and "Compressly is a PWA-ready static site — install it and it keeps working" (Features).**
There is no web-app manifest (`/manifest.json` and `/manifest.webmanifest` soft-404 to HTML; no `<link rel=manifest>`), no service worker (`/sw.js` soft-404; 0 `serviceWorker` references in the bundle; 0 registrations in the render), and `worker.ts` lazy-loads every codec with a dynamic `import()` on first use — so the app cannot be "installed", and any format not yet used fails the moment the network drops. This is a C2-class accuracy defect that five agents walked past, **and the audit propagates it**: schema template A's `featureList` says "Works offline once the page has loaded" and the llms.txt draft says "works offline once loaded". Fix the copy (or ship a real manifest + SW) before either template is used.

**N3. The H1 number is unsourced and contradicted by the site's own pages.** "Compress images 10× smaller" (= 90 % reduction) sits above landing pages that claim 25–80 %. H1s are the first thing extractors quote.

**N4. "We fan out to all your CPU cores"** — `engine.ts` caps the pool at `min(4, cores-1)`. Minor overreach; say "up to 4 parallel workers".

**N5. The audit package contradicts itself and the synthesis hid it.** (a) Main report header "Audit Date: 2026-07-24" vs 2026-09-04 in all five sub-reports. (b) "domain registered today" (main, H4) vs RDAP 2026-07-24 (AI-visibility). (c) Bing "own domain indexed / ~440 results" (AI-visibility) vs "0 pages" (platform). (d) "no referring domains" (technical, platform) vs Ahrefs 258. (e) AI-visibility recommends "create a Wikidata item"; schema says "do not add" Wikipedia/Wikidata. (f) AI-visibility calls the schema mismatch "minor"; synthesis makes it CRITICAL. A synthesis should surface disagreements, not pick one silently.

**N6. Privacy/terms "Last updated: 2026-05-28" predates the domain's existence (registered 2026-07-24).** Cosmetic, but it is exactly the kind of inconsistency an AI fact-checker or a suspicious buyer notices. Refresh when editing M2.

**N7. Nobody checked the Google index.** All five agents assumed "Googlebot renders JS" and scored Google AIO 42 / Gemini 21 on that assumption; none looked at the GSC Pages report, and I could not either. The operator can in one minute. Treat the two Google platform scores as unverified inputs.

---

## 4. Is 34/100 fair?

Arithmetically yes, under the rubric. Structurally the rubric spends **20 % of the score on Brand Authority (2/100)** and a further slice of Platform (30/100) on Bing indexing and community mentions — none of which any commit can move on day one. The current ex-brand score is (10.5 + 7.4 + 9.45 + 2.8 + 3.0) / 0.80 ≈ **41/100**.

**Defensible fixable-by-code estimate** (one focused week of code-only work — prerender/fallback, copy fixes, schema sync + Organization graph, 404/og/favicon, redirects/headers, dates, an About page with the real operator identity, no new content pages):

| Category | Now | After code week | Weighted after |
|---|---|---|---|
| AI Citability (25 %) | 42 | ~55 | 13.75 |
| Brand Authority (20 %) | 2 | 2 | 0.40 |
| Content E-E-A-T (20 %) | 37 | ~48 | 9.60 |
| Technical GEO (15 %) | 63 | ~85 | 12.75 |
| Schema (10 %) | 28 | ~68 | 6.80 |
| Platform (10 %) | 30 | ~40 | 4.00 |
| **Rubric total** | **34** | | **≈ 47** |
| **Ex-brand (÷0.80)** | **41** | | **≈ 59** |

So: **34 today; ~47 is the ceiling of a pure-code pass under this rubric; ~59 if you score only what code can touch.** Any re-audit claiming 60+ in week one without off-site mentions is fantasy — flag it.

---

## 5. Corrected priority order for a solo operator (lift per hour)

| # | Do this | Time | Why it beats the audit's order |
|---|---|---|---|
| 1 | **Set `VITE_LS_CHECKOUT_URL`, rebuild, redeploy, click the live button** (C5) | 15 min once the LS product exists | Only item with revenue attached; every other fix routes buyers into a 404 until this lands |
| 2 | **Static fallback inside `#root` in `index.html`**: H1 + one definitional paragraph, feature list, pricing, all 8 FAQs as `<details>`, nav to the 5 landing pages + privacy/terms + plain-text email. React replaces it on mount. **Fix C2, N2, N3, N4 copy in the same edit** (`FAQ.tsx`, `Hero.tsx`, `Features.tsx`, `Footer.tsx`, `index.html` JSON-LD) | 1.5–2 h | Same technique the landing pages already prove works; no SSR/hydration risk on a WASM-worker app. Do **not** start with a prerender plugin |
| 3 | **`public/404.html` + `og.png` (1200×630) + `favicon.ico` + `apple-touch-icon.png`** (H1, H8) | 30–45 min | Unblocks every link preview and lets schema carry `image` |
| 4 | **Landing-page copy-sync (C3) + Organization/@graph with corrected facts and an empty `sameAs`** (H5) | 1 h of static-HTML edits | Generate FAQ/HowTo JSON-LD from the visible strings so they cannot drift again |
| 5 | **Dashboard/one-liner bundle:** Bing WMT import + sitemap (C4) · `_redirects` www→apex (H3) · HSTS + `X-Frame-Options: DENY` (H7-lite) · Cache Rule for `/assets/*.wasm` (M5) · `/privacy` `/terms` hrefs (M6) | 30 min total | Cheap hygiene, done in one sitting |

Then, in order: `llms.txt` (H2, 15 min, after N2 wording is fixed) · privacy wording or beacon toggle (M2) · visible dates + real `lastmod` (M4) · About page with the operator's actual identity (only what is true).

**Busywork or premature this week (push to week 3+ or drop):**
- Week-4 "five new pages" and the Gemini "60–90 s video per landing page + VideoObject", LinkedIn company page, Chrome Web Store — five more clones of a template with no evidence, before the homepage renders and before there is a checkout, add five more low-uniqueness pages.
- "Expand every page to 1,200–1,500 words" — the content report's own SERP data shows CloudConvert ranks #1 with ~140 words at DR 82; length is not the lever, and the report says so.
- Creating a Wikidata item — a day-old product fails Wikidata notability, will be deleted, and the schema sub-report explicitly says not to.
- `speakable` schema — Google limits it to news publishers; zero expected lift.
- `Content-Signal` header — emerging, no measurable effect.
- Full CSP — risk > reward; `Report-Only` if at all.
- "Trim intros to the 134–167-word band" — overfitting to one scorer's heuristic.
- IndexNow deploy-script ping — negligible for 6 URLs; manual URL submission in BWT does the same.
- The 500-image benchmark page — a genuinely good asset, but it is a day of measured work; schedule after the code week and publish only numbers you actually measured.

---

## 6. Recommendations that would introduce a fabrication or a risk

| # | Where | Problem | Do instead |
|---|---|---|---|
| F1 | `geo-schema.md` template A, FAQPage | Copies **all three C2 errors verbatim** ("Google's MozJPEG", "TinyPNG … only supports JPG/PNG/WebP", "better compression than AVIF") into a new, larger schema block. Implementing Quick Win 8 before Quick Win 3 re-ships the errors | Fix `FAQ.tsx` first; generate schema from the corrected strings |
| F2 | Template A `featureList`; llms.txt draft "Key Facts" | "Works offline once the page has loaded" — unsupported (N2) | Delete, or rewrite to what is true ("formats you have already used keep working offline") |
| F3 | llms.txt draft | "Website launched: September 2026" — the site has served since 2026-07-24 (cert `notBefore`, RDAP); "launched" has no on-site source | Mark `[FILL]` or omit |
| F4 | Main report H4 "sameAs pointing at owned profiles (create them: GitHub org/repo, X, Product Hunt, LinkedIn)" | Creating a LinkedIn *company* page asserts a company that is not named anywhere on the site (schema sub-report correctly omits legal entity/founder). Dead or placeholder `sameAs` URLs are worse than none | Add each `sameAs` only after the profile exists and only for profiles that state facts the site also states |
| F5 | M2 proposed wording "Cloudflare Web Analytics (cookieless, no personal data)" | "No personal data" is a legal claim nobody verified (the beacon sees IPs transiently) | Either turn Web Analytics off in the Cloudflare dashboard (page becomes true with no edit) or quote Cloudflare's own description |
| F6 | Template A `Offer.availability: InStock` + `url` for Pro | Advertises stock for something unpurchasable until C5 lands | Enforce ordering: C5 before H5 |
| F7 | Template A `logo` → `/logo.png`; `image` → `/og.png`; `screenshot` | Files do not exist (template flags this — good) | Ship assets before adding any image property |
| F8 | Template A `softwareVersion: "0.1.0"` | Internal package version, never published anywhere users can see | Skip until a visible changelog exists |
| F9 | H7 "add a CSP" | Needs `'wasm-unsafe-eval'`, `worker-src 'self'`, `connect-src api.lemonsqueezy.com`, `style-src` for Google Fonts, `script-src static.cloudflareinsights.com` and `/cdn-cgi/` for CF's injected scripts; one omission breaks the tool silently | `Content-Security-Policy-Report-Only` for two weeks first |
| F10 | H7 HSTS | Safe with `includeSubDomains` (www serves HTTPS) | Do **not** add `preload` yet |
| F11 | AI-visibility §4 "Create a Wikidata item" | See busywork; also contradicts the schema sub-report | Drop |
| F12 | Breadcrumb alignment | Visible crumb is "Home" (link title "Compressly home") | Change schema item 1 to "Home", not the other way |

Things the audit got *right* on fabrication that I want kept: no `aggregateRating`/`review`; no invented founder/legal entity/address; `[FILL]` markers in the llms.txt draft; "do not add SearchAction".

---

## 7. Certification

| | |
|---|---|
| **Audit report quality** | **B-** — factually reliable on the site, unreliable on severity, off-site evidence and its own internal consistency |
| **Site quality (GEO)** | **C** — landing pages B-, homepage D, conversion path F until C5 |
| **Production readiness** | **NEEDS WORK** — automatic-fail trigger present: the only purchase path is a 404 (C5) |
| **Revision cycles expected** | 2 (code week → re-audit → evidence week → re-audit) |
| **Re-assessment gate** | Raw `curl /` shows H1 + ≥5 internal links; live "Get Pro" resolves to a 200 Lemon Squeezy checkout; `/og.png` returns `image/png`; `/nonexistent` returns 404; FAQ/HowTo parity script reports 20/20 and 15/15; homepage copy no longer says "Google's MozJPEG", "PWA-ready" or "Works offline" |

**Evidence location:** `/private/tmp/claude-501/-Users-j/ff2480b3-8681-461f-95b9-b48d3fd6740d/scratchpad/rc/` (raw fetches `home.html`, `png-to-webp.html`…, `live-bundle.js`, `bing.html`, `bing3.html`, `rdap.json`, `itunes.json`, `tinypng.html`, `home_browser.html`, `privacy_browser.html`).
