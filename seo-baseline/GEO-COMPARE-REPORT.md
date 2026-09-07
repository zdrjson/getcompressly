# GEO Delta Report: Compressly

**Reporting period:** 2026-07-24 (baseline) → 2026-09-04 (re-audit)
**URL:** https://getcompressly.com
**Report reference:** GEO-COMPARE-getcompressly.com-260904
**Method:** independent live re-measurement (curl + BeautifulSoup `html.parser` + `geo/scripts/citability_scorer.py`). Every claimed fix verified against the live apex, not against source or changelog. Baseline critiques (`critique-reality-checker.md`, `critique-seo-specialist.md`, `critique-ai-citation-strategist.md`) applied as binding corrections to severity and scoring ceilings.

---

## Executive Summary

**Overall GEO Score: 34 → 46/100 (+12)** — Critical → Poor.

The deployed round did what code can do, and did it honestly. The single largest baseline defect (C1: a homepage whose served body was `<div id="root"></div>`) is genuinely gone — the apex now serves 576 words, one H1, 4 H2s, 8 FAQ H3+p pairs and links to all five landing pages before any JavaScript runs. Schema/visible-text parity went from 3/20 questions, 0/20 answers and 0/15 HowTo steps to a verified **20/20, 20/20 and 15/15**. Every fabricated or overreaching claim the baseline and critiques flagged (`Google's MozJPEG`, the TinyPNG/AVIF error, `Works offline once loaded`, `PWA-ready`, `10× smaller`, `all your CPU cores`, the browsers-use-these-encoders overreach) is gone from the live HTML.

The ceiling is exactly where the Reality Checker predicted it would be. That critique projected "**~47 is the ceiling of a pure-code pass under this rubric; ~59 if you score only what code can touch**" and warned that "any re-audit claiming 60+ in week one without off-site mentions is fantasy — flag it." This audit lands at **46 rubric / 57 ex-brand**, marginally *under* both projections, because two items in the projected code week — an About page and visible dates — were not shipped.

Nothing in this round moved the two categories that decide whether an AI actually cites the site: Brand Authority is still **2/100** (zero owned profiles, zero third-party mentions), and the five landing pages still carry **0 images, 0 outbound citations, no author, no dates and no first-party data**. The work completed is *entity and delivery hygiene*. It makes Compressly readable and truthful. It does not yet make it citable.

One regression deserves attention: the enriched schema now asserts `availability: https://schema.org/InStock` on a **$39 Offer whose checkout URL still 404s**. The baseline critique explicitly ordered "C5 before H5 (no `InStock` offer for an unpurchasable product)" — that ordering constraint was violated, so the structured data now makes a *stronger* false claim than it did at baseline.

---

## GEO Score Progress

```
OVERALL GEO SCORE (full rubric, Brand Authority weighted 20%)

  Baseline   [▓▓▓▓▓▓▓░░░░░░░░░░░░░]  34/100  (Critical)
  Current    [▓▓▓▓▓▓▓▓▓░░░░░░░░░░░]  46/100  (Poor)
  Change     ▲ +12 points (+35.3%)

  RC projected ceiling for a pure-code pass: ~47  → landed 46 (just under)


FIXABLE-BY-CODE SCORE (Brand Authority excluded, weights renormalised ÷0.80)

  Baseline   [▓▓▓▓▓▓▓▓░░░░░░░░░░░░]  41/100
  Current    [▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░]  57/100
  Change     ▲ +16 points (+39.0%)

  RC projected ceiling: ~59  → landed 57 (just under; no About page, no dates)
```

---

## Score Breakdown: Before vs. After

| Category | Weight | Baseline | Current | Change | Trend |
|---|---|---|---|---|---|
| AI Citability | 25% | 42/100 | **54**/100 | +12 | ▲▲ |
| Brand Authority | 20% | 2/100 | **2**/100 | 0 | ── |
| Content E-E-A-T | 20% | 37/100 | **45**/100 | +8 | ▲▲ |
| Technical GEO | 15% | 63/100 | **84**/100 | +21 | ▲▲ |
| Schema & Structured Data | 10% | 28/100 | **64**/100 | +36 | ▲▲ |
| Platform Optimization | 10% | 30/100 | **39**/100 | +9 | ▲▲ |
| **OVERALL (rubric)** | | **34/100** | **46/100** | **+12** | **▲▲** |
| **OVERALL (ex-brand)** | | **41/100** | **57/100** | **+16** | **▲▲** |

**Weighted arithmetic (current):** (54×0.25) + (2×0.20) + (45×0.20) + (84×0.15) + (64×0.10) + (39×0.10) = 13.5 + 0.4 + 9.0 + 12.6 + 6.4 + 3.9 = **45.8 → 46**
**Ex-brand:** (13.5 + 9.0 + 12.6 + 6.4 + 3.9) ÷ 0.80 = 45.4 ÷ 0.80 = **56.75 → 57**

### Why each category moved where it did

**AI Citability 42 → 54.** Homepage went from **0 extractable blocks to 11**, average citability **46.4**, best block 58. All five landing pages are *unchanged* (avg 52.3 / 50.3 / 42.7 / 37.8 / 39.2 = 44.5; best block still 65 — identical to baseline) because no content work was done on them. `llms.txt` is present and genuinely good, but the critiques downgraded its value hard ("97% of llms.txt files got zero requests"; Google confirmed it does not use it), so it is credited modestly. Held below RC's 55 ceiling because `uniqueness_signals` scores **0 on every block on every page** — there is still no first-party data anywhere on the site.

**Brand Authority 2 → 2.** Deliberately unmoved. No owned profiles, no third-party mentions, no `sameAs`. The Organization `disambiguatingDescription` / `alternateName` and the llms.txt entity note are real work, but they are on-site entity markup and are already credited under Schema — counting them here too would be double-counting, which is precisely the victory-lap scoring the critiques warned against. RC: "the score (2/100) is a fair reading of off-site reality and **no code changes it**."

**Content E-E-A-T 37 → 45.** Trustworthiness rises materially: every fabricated claim removed (verified live), privacy page now names Cloudflare Web Analytics accurately, footer typo fixed. Experience / Expertise / Authoritativeness are **flat** — still no author, no About page, no dates, no evidence, no citations, 0 images. Held below RC's 48 ceiling specifically because that ceiling assumed an About page and visible dates, neither of which shipped, and because two live trust defects persist (see N-F, N-G).

**Technical GEO 63 → 84.** The biggest category gain. C1, H1, H7, H8, M3, M6 and L2 all verified resolved. Held at 84 rather than higher by the unresolved www duplicate host, the stale sitemap `lastmod`, the still-DYNAMIC WASM edge cache, and the homepage email obfuscation.

**Schema 28 → 64.** C3 fully resolved (20/20, 20/20, 15/15 — the strongest single verified result in this audit) and H5 largely resolved. Docked from RC's 68 ceiling for the `InStock`-on-a-dead-product regression (N-A), the unchanged homepage FAQ coverage gap (M9), and 2 of 6 homepage answers not matching verbatim (N-E).

**Platform 30 → 39.** Google AIO, Perplexity and Gemini all benefit directly from a homepage that non-JS crawlers can now read. ChatGPT and Bing Copilot **cannot move** — Bing indexing is still unaddressed (no `BingSiteAuth.xml`, no `msvalidate.01` meta, no IndexNow key; all probes 404). Two of five platforms remain structurally dark, which caps this category near RC's 40.

---

## Baseline Issue Status

### ✅ RESOLVED (12)

| ID | Issue | Verification |
|---|---|---|
| **C1** | Homepage 100% client-rendered | `curl /` → `#root` contains **576 words, 1 H1, 4 H2, 8 H3**, 9 links incl. **all 5 landing pages** (`/png-to-webp`, `/jpg-to-webp`, `/webp-to-png`, `/webp-to-jpg`, `/compress-webp`). `FAQ.tsx:58` now `hidden={open !== i}` — all 8 answers in DOM. |
| **C2** | Factual errors | Live HTML: `MozJPEG (Mozilla)`; TinyPNG rewritten to "compresses on its servers, so your files are uploaded"; `up to 80% smaller`; `up to four Web Workers`. Zero hits for `Google's MozJPEG`, `Works offline`, `PWA`, `10× smaller`, `all your CPU cores`, `browsers themselves use` across all 6 pages. |
| **C3** | FAQ/HowTo JSON-LD ≠ visible text | Normalised verbatim match across 5 landing pages: **questions 20/20, answers 20/20, HowTo steps 15/15**. Was 3/20, 0/20, 0/15. |
| **H1** | Soft-404 everywhere | `/nonexistent-random-path-12345` → **HTTP 404**. `/about` → 404. `404.html` carries `<meta name="robots" content="noindex, follow">` and links all 5 converters. |
| **H2** | No llms.txt | `/llms.txt` → 200, `text/plain`, 3138 bytes. Includes per-page descriptions, Key Facts and a "Notes for AI systems" entity-disambiguation block. |
| **H7** | Missing security headers | Live: `strict-transport-security: max-age=31536000; includeSubDomains`, `x-frame-options: DENY`, `permissions-policy: interest-cohort=(), camera=(), microphone=(), geolocation=()`, `content-security-policy-report-only: …`. |
| **H8** | Missing image assets | `/og.png` → 200 `image/png` 37685 B · `/favicon.ico` → 200 `image/vnd.microsoft.icon` · `/apple-touch-icon.png` → 200 `image/png`. All previously soft-404 HTML. |
| **M2** | Privacy contradicts reality | Live: "Compressly uses **Cloudflare Web Analytics** to count page views. It is cookieless, collects no personal data…". |
| **M3** | Meta description 203 chars | Now **123 chars**. |
| **M6** | 308 hop on legal links | Homepage fallback links are `/privacy` and `/terms` (no `.html`). |
| **M8** | Minor copy accuracy | Footer typo fixed; encoder overreach and JXL/AVIF assertion gone from all 5 landing pages. |
| **L2** | Permissions-Policy FLoC-only | Extended to camera / microphone / geolocation. |

### 🟡 PARTIAL (3)

| ID | Issue | What landed / what did not |
|---|---|---|
| **H5** | Minimal schema | **Landed:** `@graph` with `Organization` (`@id`, `alternateName`, `disambiguatingDescription`, `email`, `logo`, `knowsAbout`), `WebSite` (`publisher` ref), `SoftwareApplication`+`WebApplication` (`featureList`, `isAccessibleForFree`, `browserRequirements`, `applicationSubCategory`, `image`, named `Offers`). All blocks parse. `aggregateRating` correctly still absent. **Did not land:** no `sameAs` (correct — no profiles exist), and the Pro Offer asserts `InStock` on a dead checkout → see **N-A**. |
| **M5** | `.wasm` not edge-cached | **Landed:** `content-type: application/wasm` + `cache-control: public, max-age=31536000, immutable`. **Did not land:** `cf-cache-status: DYNAMIC` on two consecutive warm requests — the edge still is not caching it. Header also emitted twice → see **N-C**. |
| **M7** | Email obfuscated | **Mitigated:** `hello@getcompressly.com` is now plain text in the `Organization` JSON-LD and in `llms.txt`, so crawlers and AI can read it. **Not fixed:** the visible footer link is still `/cdn-cgi/l/email-protection` — and now appears on the homepage too → see **N-D**. |

### ── UNCHANGED (10)

| ID | Issue | Evidence |
|---|---|---|
| **C4** | Zero Bing index; no BWT; no IndexNow | `/BingSiteAuth.xml` → 404 · `/.well-known/indexnow-key.txt` → 404 · `/indexnow.txt` → 404 · no `msvalidate.01` meta. (Per critique: "no BWT" remains *unverifiable* from outside — a GSC import leaves no on-page trace. Absence of the key file is verifiable and is what is scored.) |
| **C5** | "Get Pro — $39" is dead | Live bundle `/assets/index-DiK-lF_m.js` still ships `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`; that URL returns **404**. `VITE_LS_CHECKOUT_URL` still unset at build. |
| **H3** | www duplicate host | `https://www.getcompressly.com/` → **HTTP 200, no redirect**. `_redirects` removed (correctly — Pages cannot host-match); needs a zone Redirect Rule. |
| **H4** | Brand collision, zero mentions | No owned profiles created; no `sameAs`; no `/about`. Entity disambiguation markup added but off-site reality unchanged. |
| **H6** | Landing pages have no evidence | Measured live, all 5: **0 images, 0 external citations, 0 author, 0 dates**, FAQ still in `<details>` (0 H3s), 1 table each, 661–738 words. First paragraph under H1 is 23–27 words of marketing copy, not a definition block. No first-party benchmark. |
| **M1** | Content breadth | Still exactly 5 WebP-cluster pages. (Critique **upgraded** this to HIGH: "this is where the organic traffic will actually come from.") |
| **M4** | No dates; sitemap lastmod | No visible dates on any page. Sitemap `lastmod` still `2026-07-24` on all 6 URLs → see **N-F**. |
| **M9** | Homepage FAQ coverage gap | Visible fallback has **8** FAQ H3s; `FAQPage` schema has **6**. Missing: "Does Pro work across browsers and devices?" and "What's your refund policy?" — the same 2 as baseline. |
| **L1** | No Content-Signal header | Absent. |
| **L3** | COOP/COEP | Still present and correct — **keep**. `cross-origin-embedder-policy: require-corp`, `cross-origin-opener-policy: same-origin`. |

**Counts: 12 RESOLVED · 3 PARTIAL · 10 UNCHANGED** (of 25 baseline C/H/M/L issues tracked).

---

## New Issues Introduced or Newly Visible

⚠️ **N-A — Schema now asserts `InStock` on an unpurchasable $39 product.** *(High — truthfulness regression)*
`SoftwareApplication.offers[1]` = `{"name":"Pro","price":"39","availability":"https://schema.org/InStock","url":"…/#pricing"}` while the live checkout 404s. At baseline the $39 Offer existed but carried **no** `availability`; the enrichment made the false claim *stronger*. This is exactly the ordering constraint the Reality Checker specified — "C5 before H5 (no `InStock` offer for an unpurchasable product)" — and it was violated. **Fix:** either wire `VITE_LS_CHECKOUT_URL` (preferred, fixes C5 too) or drop the Pro Offer / set `availability` to `PreOrder` until checkout is live.

⚠️ **N-B — CSP-Report-Only reports to nowhere.** *(Low)*
The policy contains no `report-uri` and no `report-to` directive. The only `report-to` response header is Cloudflare's own `cf-nel` NEL group (network error logging), which CSP does not use. The policy is therefore inert: it blocks nothing (correct, by design) but also **collects nothing**, so the stated plan to "promote to `Content-Security-Policy` only after the report endpoint shows no legitimate violations" can never be satisfied. **Fix:** add `report-to csp-endpoint` plus a `Reporting-Endpoints` header, or accept it as documentation-only.

⚠️ **N-C — `.wasm` `Cache-Control` emitted twice, and still not edge-cached.** *(Low)*
Both the `/*.wasm` and `/assets/*` rules in `public/_headers` match `/assets/*.wasm`, producing `cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable`. Valid but sloppy. More importantly `cf-cache-status` remained **DYNAMIC** across two consecutive warm requests, so the intended M5 benefit is not being realised. **Fix:** scope the `/assets/*` rule to exclude `.wasm`, and check whether a Cache Rule is needed for Pages to cache `application/wasm` at the edge.

⚠️ **N-D — Homepage footer email is now Cloudflare-obfuscated.** *(Low)*
The static fallback introduced a visible footer, and its contact link renders as `/cdn-cgi/l/email-protection` with a `__cf_email__` span. At baseline the homepage had no rendered footer at all, so M7 affected only privacy/terms; it now affects the primary page too. Partly mitigated because the plain address is in the JSON-LD and llms.txt.

⚠️ **N-E — Homepage FAQ schema/visible parity is 4/6, not 6/6.** *(Low)*
Landing pages are a clean 20/20, but two homepage answers differ from the visible fallback: `"25MB"`/`"200MB"` in schema vs `"25 MB"`/`"200 MB"` visible (whitespace), and one genuinely reworded sentence — schema `"You can verify by opening DevTools → Network tab while compressing."` vs visible `"Open DevTools → Network tab while compressing to verify nothing is sent."`. Cheap to close; the same sync discipline applied to the landing pages should be applied here.

⚠️ **N-F — Sitemap `lastmod` is now actively wrong.** *(Low)*
All 6 URLs still declare `2026-07-24`, but page content was materially rewritten on 2026-09-04. At baseline this was merely stale; it is now a false freshness signal at precisely the moment the site *wants* re-crawling.

⚠️ **N-G — Legal pages still dated before the domain existed.** *(Low, carried from critique N6)*
`/privacy` and `/terms` both read `Last updated: 2026-05-28`; the domain was registered `2026-07-24`. The privacy page's analytics section was rewritten in this round without updating the date next to it, so an accurate paragraph now sits under an impossible timestamp.

### Explicitly checked and clean (no new issue)

- ✅ **No hydration mismatch.** `src/main.tsx` uses `createRoot(...).render(...)`, not `hydrateRoot`. React 18 clears the container's existing children on first render, so the static fallback is replaced wholesale — no hydration warnings, no double-render. The `hydrateRoot` symbols in the bundle are unused react-dom exports.
- ✅ **No cloaking / duplicate-content divergence.** The fallback H1 ("Compress images up to 80% smaller without losing what matters.") is verbatim identical to `Hero.tsx`, and the fallback's factual claims (`up to four Web Workers`, `up to 80% smaller`) match the React components exactly. Non-JS and JS crawlers see the same claims.
- ✅ **CSP-Report-Only blocks nothing.** Header name confirmed as `content-security-policy-report-only`; no enforcing CSP is present. WASM, workers, fonts and the Cloudflare analytics script are unaffected.
- ✅ **404.html breaks nothing.** Real assets still resolve with correct MIME types; only genuinely unknown paths 404. `noindex, follow` is set correctly.
- ✅ **All 18 JSON-LD blocks still parse** and validate structurally across all 6 pages.
- ✅ **AI crawler access still 100/100.** `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot plus `User-agent: *`, and declares the sitemap.

---

## This Round's Wins

✅ **The homepage is readable by non-JS AI crawlers for the first time.** 0 → 576 words, 0 → 11 extractable citability blocks, 0 → 5 internal links to the landing cluster. This was the #1 baseline defect and it is properly fixed, in the served HTML, not just in a headless render.

✅ **Schema/visible-text parity is perfect on the landing cluster.** 20/20 questions, 20/20 answers, 15/15 HowTo steps, independently re-measured with Unicode/whitespace normalisation. From 3/20, 0/20, 0/15.

✅ **Every known false statement is gone from the live site.** Including the two the critiques found that the baseline audit itself had propagated into its own schema templates and llms.txt draft ("Works offline once loaded", "PWA-ready"). This was the single most important E-E-A-T item available to code.

✅ **Technical foundation is now genuinely solid** — 63 → 84. Real 404s, real assets, HSTS, frame-denial, and honest Report-Only CSP staging.

---

## The Single Biggest Constraint

**Compressly still has nothing an AI can only get from Compressly.**

Every remaining category ceiling traces to one root cause. Brand Authority is 2/100 because there are zero third-party mentions and zero owned profiles. Citability is capped near 55 because `uniqueness_signals` scores **0 on every measured block on every page** — the site's statistics ("25–80% smaller", "25–35%", "30–60%") are unsourced generalities that a model can already produce from its own weights, so there is no reason to cite this page over TinyPNG's or Squoosh's. E-E-A-T is capped because there is no author, no About page, no dates and no evidence. Platform is capped because two of five engines are Bing-backed and Bing indexing is untouched.

Code fixed the *delivery* problem completely. It cannot fix the *evidence* problem or the *identity* problem, and those are what convert a readable page into a cited one. The next 12 points will not come from another engineering pass — they will come from publishing one original benchmark, putting a name and a date on the pages, and getting the product mentioned somewhere that is not this domain.

A secondary, non-GEO constraint worth stating plainly: **the product still cannot be bought.** Every point of GEO improvement currently routes traffic to a $39 button that 404s.

---

## Next Actions

| # | Action | Owner | Fixes | Expected impact |
|---|---|---|---|---|
| **1** | Set `VITE_LS_CHECKOUT_URL`, rebuild, redeploy | Dev | **C5 + N-A** | Unblocks all revenue and removes the false `InStock` claim in one commit. Highest value-to-effort item on the board; also satisfies the last failing item in the Reality Checker's re-assessment gate. |
| **2** | Publish one first-party benchmark (fixed image set, real before/after byte sizes per format) as a table reused across all 5 landing pages; add visible author + "Updated" date; fix sitemap `lastmod` and the legal-page dates | Content + Dev | H6, M4, N-F, N-G | The only lever that lifts Citability past ~55 and E-E-A-T past ~48. Critique: "the HIGHEST content lever… the only asset an LLM can't get elsewhere." Est. **+6–9 overall**. |
| **3** | Create owned profiles (GitHub org, Product Hunt, X) and wire `sameAs`; import GSC → Bing Webmaster Tools and ship an IndexNow key | Owner | H4, C4, and the `sameAs` half of H5 | The only path that moves Brand Authority off 2 and un-darks ChatGPT + Copilot (2 of 5 platforms). Nothing on-site can substitute. |

**Realistic target for the next pass:** 52–55/100 rubric (65–68 ex-brand) *if and only if* items 2 and 3 both land. Another pure-code round cannot exceed ~48 — the rubric headroom in Technical and Schema is nearly exhausted (84 and 64 of a realistic ~90 and ~72).

**Do not expect traffic yet.** Per the SEO critique's calibration, technical fixes alone yield on the order of 63 impressions / 9 clicks in 28 days; organic clicks of 100–300/month are a day-61–90 outcome and require link acquisition that has not started.

---

## Deferred / Do Not Bother

Carried forward from the critiques, and re-confirmed as still not worth doing: Wikidata item (fails notability), `speakable` markup, `Content-Signal` header (L1), an IndexNow deploy script (the static key file is enough), a LinkedIn company page, and cloning the template to 5–15 more pages — the last actively worsens the existing doorway-pattern risk, since all five landing pages already funnel to the same `/?to=X#tool` anchor on a single tool. Trimming passages to the "134–167-word citation band" remains checklist theater.

---

*GEO Delta Report — Compressly — 2026-09-04*
*Baseline: `GEO-AUDIT-REPORT.md` (2026-07-24). Scoring rubric: `geo-audit/SKILL.md`. Format: `geo-compare/SKILL.md`.*
*All findings in this report were verified against the live site. Estimates are labelled as estimates.*
