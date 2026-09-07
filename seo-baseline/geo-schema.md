# Schema & Structured Data — getcompressly.com

Audit date: 2026-09-04 · Method: `~/.claude/agents/geo-schema.md` (detect → validate → rich-result eligibility → GEO gaps → templates → score)
Scope: all 6 sitemap URLs, fetched live from the apex (`curl -sL --retry 3`, all HTTP 200). Every JSON-LD block was parsed with Python `json`, then every `@type` and property was checked against the live schema.org vocabulary (`schemaorg-current-https.jsonld`, pulled 2026-09-04). Google requirements were read from the live Software App documentation, not from memory.
**Analysis only — nothing under `/Users/j/Downloads/compressly` was modified.**

---

**Schema Score: 28/100 — Poor**

| Component | Pts | Awarded | Basis |
|---|---|---|---|
| Organization (+ sameAs) | 20 | 0 | No Organization schema anywhere on the site |
| SoftwareApplication completeness ¹ | 15 | 8 | Present and valid; missing image/screenshot, featureList, softwareVersion, author/publisher, isAccessibleForFree; Offers lack name/availability/url |
| Schema ↔ visible-content parity ¹ | 15 | 3 | Landing pages: 0/20 FAQ answers and 3/20 questions appear on-page verbatim; HowTo step text differs on 5/5 pages. Homepage: 6/8 FAQ match but body is client-rendered and only the open accordion answer exists in the DOM |
| sameAs completeness | 15 | 0 | No sameAs, no external profiles found in source |
| speakable | 10 | 0 | Absent |
| BreadcrumbList | 5 | 4 | Valid on 5/5 inner pages; item 1 name "Compressly" vs visible crumb "Home" |
| WebSite + SearchAction | 5 | 3 | WebSite present and valid; SearchAction N/A (site has no search page — do **not** add one) |
| No deprecated schemas | 5 | 0 | HowTo (rich result removed Sep 2023) on 5 pages |
| JSON-LD format | 5 | 5 | 18/18 blocks JSON-LD; zero Microdata/RDFa |
| Validation (syntax + vocabulary) | 5 | 5 | 18/18 parse; every type and property valid for its declared type |

¹ The agent rubric's Article (15) and Person (15) lines are not applicable to a SaaS tool with no articles or named authors; they were replaced by the two SaaS-relevant lines above. Scored literally against the unmodified rubric the site gets **15/100** (Breadcrumb 5 + JSON-LD 5 + Validation 5).

Server-rendering check passes: all 18 blocks sit in the static `<head>` of the raw HTML, so Google, GPTBot, ClaudeBot and PerplexityBot all see them without executing JS.

---

## Detected Structured Data

**Total schema blocks found:** 18 across 6 URLs · **Format:** JSON-LD only (0 Microdata / 0 RDFa attributes) · **Delivery:** static `<head>` on every page

| # | URL | Type | In `<head>` | JSON valid | Vocab valid | Google rich-result eligible |
|---|---|---|---|---|---|---|
| 1 | / | SoftwareApplication | Yes | Yes | Yes | **No** — Google requires `aggregateRating` **or** `review`; neither present (correct given no real reviews) |
| 2 | / | WebSite | Yes | Yes | Yes | N/A (no SearchAction; sitelinks box needs a real search page) |
| 3 | / | FAQPage (6 Q&A) | Yes | Yes | Yes | No — FAQ rich results restricted to government/health sites since Aug 2023 |
| 4–8 | 5 landing pages | BreadcrumbList | Yes | Yes | Yes | **Yes** |
| 9–13 | 5 landing pages | HowTo (3 steps) | Yes | Yes | Yes | No — HowTo rich results removed Sep 2023 |
| 14–18 | 5 landing pages | FAQPage (4 Q&A) | Yes | Yes | Yes | No (restricted) **and content mismatch — see below** |

URL consistency: every `url`, `item`, canonical and `og:url` uses `https://getcompressly.com/…` (apex, https, no trailing-slash inconsistencies). The `compressly-3wn.pages.dev` mirror canonicalizes to the apex. One host issue: `https://www.getcompressly.com/` serves the site with HTTP 200 instead of 301-redirecting to the apex (canonical tags mitigate; hand to the technical owner).

---

## Validation Results

### Block 1 — SoftwareApplication (homepage)

**Status:** Syntactically and vocabulary-valid. Not rich-result eligible. Several high-value properties missing.

| Property | Status | Value / Issue |
|---|---|---|
| @context | OK | `https://schema.org` |
| @type | OK, improvable | `SoftwareApplication` — Google also supports co-typing `WebApplication`; recommended `["SoftwareApplication","WebApplication"]` |
| @id | Missing | No stable node id → landing pages cannot reference the product entity |
| name | OK | "Compressly" |
| url | OK | `https://getcompressly.com/` |
| description | OK | Concise, matches hero copy |
| applicationCategory | OK | `MultimediaApplication` — on Google's supported list |
| operatingSystem | OK (weak) | "Web Browser" — accepted; `"Any"` + `browserRequirements` is more precise |
| offers[0] Free | Partial | price "0", USD ✔ · uses `category:"Free"` instead of `name`; no `availability`, no `url` |
| offers[1] Pro | Partial / **integrity risk** | price "39", USD ✔ · same gaps · **the deployed bundle's "Get Pro — $39" button points to the placeholder `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`** (`VITE_LS_CHECKOUT_URL` was not set at build). Structured data advertises a $39 offer that cannot currently be purchased. Fix the build env before adding `Offer.url`. |
| aggregateRating / review | Absent — **correct** | The fabricated rating was removed. Google requires one of these for the Software App rich result, so the block is intentionally ineligible until real, verifiable reviews exist. **Do not re-add.** |
| image / screenshot | Missing | No image asset exists to point to — see "Missing assets" |
| featureList | Missing | Strong AI-citation signal; all facts already visible in Features/Pricing sections |
| softwareVersion | Missing | package.json says `0.1.0` |
| isAccessibleForFree | Missing | Valid on CreativeWork subtypes; `true` is accurate (free tier) |
| author / publisher | Missing | Should reference the (missing) Organization node |
| browserRequirements | Missing | "Requires WebAssembly" is a real, useful constraint |
| datePublished / inLanguage | Missing | Low priority |

### Block 2 — WebSite (homepage)

**Status:** Valid, minimal.

| Property | Status | Value / Issue |
|---|---|---|
| name, url | OK | "Compressly", apex URL |
| @id, publisher, description, inLanguage | Missing | Add `@id: …/#website`, `publisher → #organization`, `inLanguage: "en"` |
| potentialAction (SearchAction) | N/A | Site has no search results page. Adding a SearchAction with a fake target violates Google's sitelinks-searchbox guidelines. Leave out. |

### Block 3 — FAQPage (homepage, 6 Q&A)

**Status:** Valid. Content parity partial.

- The React `FAQ.tsx` renders **8** Q&As; schema carries **6** (missing "Does Pro work across browsers and devices?" and "What's your refund policy?").
- Minor text drift on 4 answers: schema says `25MB`/`200MB`/`~3MB`, page says `25 MB`/`200 MB`/`~3 MB`; Q4 answer sentence rewritten differently in each.
- **DOM visibility problem:** the accordion is conditionally rendered (`{open === i && …}`), so only the currently-open answer exists in the DOM at all — 7 of 8 answers are absent even after JavaScript runs. Google's FAQ guidance allows collapsed content but it must be present in the markup.
- **Non-JS crawlers see no FAQ at all** — body is `<div id="root"></div>` (13 words server-rendered). For GPTBot/ClaudeBot/PerplexityBot the page carries FAQ schema for content that does not exist on the page.

### Blocks 4–8 — BreadcrumbList (5 landing pages)

**Status:** Valid, rich-result eligible.

| Property | Status | Value / Issue |
|---|---|---|
| itemListElement[].position / name / item | OK | Absolute apex URLs, positions 1–2 |
| item 1 `name` | Minor mismatch | Schema "Compressly", visible crumb "Home". Align one to the other (Google: breadcrumb names should reflect what users see) |

### Blocks 9–13 — HowTo (5 landing pages)

**Status:** Valid vocabulary; deprecated for rich results; text does not match the visible steps on any page.

| Property | Status | Value / Issue |
|---|---|---|
| name, totalTime (PT30S), step[3] with position/name/text | OK | |
| step text parity | **Fail 5/5** | e.g. png-to-webp schema step 1 "Add PNG files — Drop one or many PNG files onto the tool…" vs visible "Drop your PNG files in — Drag one image or a hundred onto the drop zone…". Same drift on all 15 steps |
| description, image, tool, step.url, step.image | Missing | `image` cannot be added until a real asset exists |

### Blocks 14–18 — FAQPage (5 landing pages, 4 Q&A each)

**Status:** Valid vocabulary; **content mismatch on every page** (measured programmatically against the `<details>` elements in `.faq`).

| Page | Questions matching visible text | Answers matching visible text | Schema-only questions | Visible-only questions |
|---|---|---|---|---|
| /png-to-webp | 1/4 | 0/4 | "How much smaller is WebP than PNG?", "Are my images uploaded to a server?", "Can I convert many PNGs at once?" | "How much smaller will my files be?", "Is there a file-size or batch limit?", "Do I need to install anything?" |
| /jpg-to-webp | 0/4 | 0/4 | all 4 | all 4 (same topics, different wording) |
| /webp-to-png | 0/4 | 0/4 | all 4 | all 4 |
| /webp-to-jpg | 1/4 | 0/4 | 3 | 3 |
| /compress-webp | 1/4 | 0/4 | 3 | 3 |

Google's FAQPage policy requires the full question and answer text to be visible on the page; AI engines likewise cross-check schema against page text before trusting it. Because the pages are static HTML, this is a copy-sync job, not an engineering one.

---

## GEO-Critical Schema Assessment

| Schema | Status | GEO Impact | Notes |
|---|---|---|---|
| Organization + sameAs | **Missing** | Critical | No entity node, no logo, no contactPoint (hello@getcompressly.com is on the page and could be used), no sameAs. AI models have nothing to anchor "Compressly" to. |
| SoftwareApplication | Partial | High | Present and valid; lacks `@id`, `featureList`, image, version, publisher, `isAccessibleForFree` |
| Schema ↔ page parity | **Failing** | High | See FAQ/HowTo tables above; homepage body invisible to non-JS crawlers |
| Person (author) | N/A | — | No named author or founder is published anywhere; do not invent one |
| Article + dateModified | N/A | — | No editorial content yet |
| speakable | Missing | Medium | Add to a `WebPage` node on landing pages targeting `.hero .sub` and `.steps` |
| BreadcrumbList | Present | Low | Valid; minor name alignment |
| WebSite + SearchAction | Present / N/A | Low | Keep WebSite; SearchAction not applicable |

## sameAs Entity Linking

**Current sameAs links found:** 0. Source tree (`src/`, `public/`, `index.html`) contains no external profile URL of any kind.

| Platform | Linked | Note |
|---|---|---|
| Wikipedia / Wikidata | No | Not achievable for a day-old product; **do not add** |
| Product Hunt | No | Highest-value first profile for a launch-day tool |
| GitHub | No | Only if the project (or a public repo/changelog) is published |
| X / Twitter | No | Create, then link |
| LinkedIn | No | Only if a real company page exists |
| AlternativeTo / G2 / Capterra | No | Listings later also feed `review` data legitimately |
| YouTube | No | — |

Add `sameAs` **only** as each profile actually goes live; an empty array is better than a dead link.

## Deprecated / Restricted Schemas

| Schema | Status | Recommendation |
|---|---|---|
| HowTo (5 pages) | Removed from Google rich results (Sep 2023) | Keep for AI step extraction **only if synced to the visible `<ol class="steps">` text**; otherwise remove. Syncing is a 10-minute copy job on static HTML. |
| FAQPage (6 pages) | Restricted to government/health for rich results (Aug 2023) | Keep — still parsed by AI engines — but make text identical to the page |

## JavaScript Rendering Risk

**Schema delivery:** Server-delivered — all 18 blocks are in the static `<head>` of the raw HTML. Good.
**Content delivery (homepage only):** Client-rendered. `has_ssr_content=false`, 13 words in the body. The 5 landing pages are fully static HTML (650–725 words each) and have no rendering risk.
Consequence: on the homepage, non-JS AI crawlers read a SoftwareApplication + FAQ schema attached to an empty page. Recommend prerendering the homepage at build time (e.g. `vite-plugin-prerender` / `vite-react-ssg`, or a static `<noscript>`/fallback block inside `#root` containing the H1, feature list, pricing and full FAQ), and switching the FAQ accordion to `<details>`/CSS-hidden so every answer is in the DOM.

## Missing assets referenced (or needed) by structured data and Open Graph

| URL | Reality | Impact |
|---|---|---|
| `https://getcompressly.com/og.png` | Returns the SPA `index.html` as `text/html` with HTTP **200** (file is not in `public/`) | `og:image` + `twitter:image` on **all 6 pages** are broken; nothing to use for schema `image`/`screenshot`/`logo` |
| `/apple-touch-icon.png` | Same soft-404 | iOS icon broken |
| `/logo.png`, `/logo.svg`, `/llms.txt` | Same soft-404 | Cloudflare Pages SPA fallback masks every missing file as 200, so validators will report "not an image" rather than 404. Only `favicon.svg` (353 bytes) exists. |

Ship a real `og.png` (1200×630) and a `logo.png` (≥112×112) into `public/` before adding any image property to the JSON-LD.

---

## Recommended JSON-LD (recommendations only — not applied)

Placeholders are marked `[REPLACE: …]`. Nothing below asserts a fact that is not already visible on the site; legal entity, address, founding date and founder are deliberately omitted because no source exists for them.

### A. Homepage — single `@graph` replacing the three current blocks

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://getcompressly.com/#organization",
      "name": "Compressly",
      "url": "https://getcompressly.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "[REPLACE: https://getcompressly.com/logo.png — create the file first; only favicon.svg exists today]",
        "width": 512,
        "height": 512
      },
      "description": "Browser-based image compression and conversion for JPG, PNG, WebP, AVIF and JXL. Built on jSquash and the Squoosh codec family.",
      "email": "hello@getcompressly.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "hello@getcompressly.com",
        "availableLanguage": ["English"]
      },
      "knowsAbout": [
        "Image compression",
        "WebP conversion",
        "AVIF encoding",
        "JPEG XL",
        "WebAssembly image codecs",
        "Client-side image processing"
      ],
      "sameAs": [
        "[REPLACE: add each profile URL only once it is live — Product Hunt, X, GitHub, LinkedIn, AlternativeTo]"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://getcompressly.com/#website",
      "name": "Compressly",
      "url": "https://getcompressly.com/",
      "description": "Free online image compressor and converter for JPG, PNG, WebP, AVIF and JXL. Runs entirely in your browser.",
      "inLanguage": "en",
      "publisher": { "@id": "https://getcompressly.com/#organization" }
    },
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": "https://getcompressly.com/#software",
      "name": "Compressly",
      "url": "https://getcompressly.com/",
      "description": "Browser-based image compressor and converter supporting JPG, PNG, WebP, AVIF and JXL. Batch processing, full quality control, zero file upload.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires a modern browser with WebAssembly support (Chrome, Edge, Firefox, Safari)",
      "isAccessibleForFree": true,
      "softwareVersion": "[REPLACE: 0.1.0 per package.json, or the version you publish]",
      "inLanguage": "en",
      "image": "[REPLACE: https://getcompressly.com/og.png — create the file first]",
      "screenshot": "[REPLACE: https://getcompressly.com/screenshot-tool.png — real UI screenshot]",
      "featureList": [
        "Batch compression and conversion between JPG, PNG, WebP, AVIF and JXL",
        "100% local processing in the browser via WebAssembly — no file upload",
        "Quality slider, resize, lossless mode, encoder effort and chroma controls",
        "ZIP download of the whole batch with original filenames",
        "Multi-core processing with Web Workers",
        "Works offline once the page has loaded",
        "Free tier: up to 20 files per batch, 25 MB per file",
        "Pro: unlimited batch size, 200 MB per file, JXL encoding, EXIF preservation"
      ],
      "author": { "@id": "https://getcompressly.com/#organization" },
      "publisher": { "@id": "https://getcompressly.com/#organization" },
      "offers": [
        {
          "@type": "Offer",
          "name": "Compressly Free",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://getcompressly.com/#tool",
          "description": "Up to 20 files per batch, 25 MB per file, JPG/PNG/WebP/AVIF, quality slider, resize, ZIP download."
        },
        {
          "@type": "Offer",
          "name": "Compressly Pro — lifetime license",
          "price": "39",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "[REPLACE: real Lemon Squeezy checkout URL — the deployed bundle currently ships the placeholder YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID]",
          "description": "One-time payment, lifetime updates. Unlimited batch, 200 MB per file, JXL, lossless mode, EXIF preservation. 14-day money-back guarantee.",
          "seller": { "@id": "https://getcompressly.com/#organization" }
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://getcompressly.com/#faq",
      "mainEntity": [
        { "@type": "Question", "name": "How does Compressly compress images?", "acceptedAnswer": { "@type": "Answer", "text": "Compressly uses Google's MozJPEG, OxiPNG, libwebp, libavif and libjxl encoders compiled to WebAssembly. All compression runs locally inside your browser — your files never touch a server." } },
        { "@type": "Question", "name": "Which image formats are supported?", "acceptedAnswer": { "@type": "Answer", "text": "JPG, PNG, WebP, AVIF and JXL — for both decoding and encoding. You can convert freely between any of them in a single pass." } },
        { "@type": "Question", "name": "Is Compressly really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The free tier handles up to 20 images per batch at 25 MB each with the four mainstream formats. Pro ($39 one-time, lifetime) removes the batch limit, raises the size cap to 200 MB, unlocks JXL encoding, lossless mode and EXIF preservation." } },
        { "@type": "Question", "name": "Are my images uploaded anywhere?", "acceptedAnswer": { "@type": "Answer", "text": "No. Compressly is a static client-side app — there is no server upload step. Open DevTools → Network tab while compressing to verify nothing is sent." } },
        { "@type": "Question", "name": "How does Compressly differ from TinyPNG or Squoosh?", "acceptedAnswer": { "@type": "Answer", "text": "TinyPNG uploads to a server and only supports JPG/PNG/WebP. Squoosh is one-image-at-a-time. Compressly stays local like Squoosh but adds true batch processing, ZIP export and a one-time Pro license for power users." } },
        { "@type": "Question", "name": "What is JXL and why does Pro require it?", "acceptedAnswer": { "@type": "Answer", "text": "JPEG XL (JXL) is a next-generation image format with better compression than AVIF at higher fidelity. Its encoder bundle is large (~3 MB WASM) so we gate it behind Pro to keep the Free experience fast." } },
        { "@type": "Question", "name": "Does Pro work across browsers and devices?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Your license unlocks Compressly on every browser and device you use it on — no seat limit. Just paste the key into \"Have a key?\" at the top." } },
        { "@type": "Question", "name": "What's your refund policy?", "acceptedAnswer": { "@type": "Answer", "text": "Lemon Squeezy handles billing with a 14-day money-back guarantee, no questions asked. Just reply to your purchase receipt." } }
      ]
    }
  ]
}
```

Notes on this block:
- **No `aggregateRating`, no `review`.** Google requires one of them for the Software App rich result; adding either without real, verifiable reviews is a fabricated-data policy violation (the exact thing that was just removed). Earn them via Product Hunt / G2 / AlternativeTo listings and add only when the numbers are reproducible on a third-party page.
- FAQ text above is copied verbatim from `src/components/FAQ.tsx` (the visible source of truth). Best practice: generate the JSON-LD from the same `QA` array at build time so the two can never drift again.
- Everything in `featureList` and the offer descriptions is already printed on the page (Features / Pricing sections).

### B. Landing-page template — `/png-to-webp` shown; repeat per page with that page's visible text

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://getcompressly.com/png-to-webp#webpage",
      "url": "https://getcompressly.com/png-to-webp",
      "name": "Convert PNG to WebP — Free, Private, In Your Browser",
      "description": "Turn PNG images into WebP and cut file size 25–80% while keeping transparency. Batch convert in your browser — no upload, no watermark, free.",
      "inLanguage": "en",
      "isPartOf": { "@id": "https://getcompressly.com/#website" },
      "about": { "@id": "https://getcompressly.com/#software" },
      "breadcrumb": { "@id": "https://getcompressly.com/png-to-webp#breadcrumb" },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".hero .sub", ".steps"]
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://getcompressly.com/png-to-webp#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getcompressly.com/" },
        { "@type": "ListItem", "position": 2, "name": "PNG to WebP", "item": "https://getcompressly.com/png-to-webp" }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://getcompressly.com/png-to-webp#howto",
      "name": "Convert PNG to WebP in three steps",
      "description": "Shrink PNG files by 25–80% and keep the alpha channel intact. Everything runs in your browser — no upload, no watermark, no sign-up.",
      "totalTime": "PT30S",
      "tool": { "@type": "HowToTool", "name": "Compressly (web browser)" },
      "step": [
        { "@type": "HowToStep", "position": 1, "url": "https://getcompressly.com/png-to-webp#how", "name": "Drop your PNG files in", "text": "Drag one image or a hundred onto the drop zone. They load straight into memory — no upload bar, because there is nothing to upload." },
        { "@type": "HowToStep", "position": 2, "url": "https://getcompressly.com/png-to-webp#how", "name": "Keep WebP as the output", "text": "The format is already set to WebP. Leave quality at 75 for a strong size cut you can't see, or push it lower for maximum savings." },
        { "@type": "HowToStep", "position": 3, "url": "https://getcompressly.com/png-to-webp#how", "name": "Download your WebP", "text": "Grab a single file, or hit \"Download all as ZIP\" to pull the whole batch at once. Original filenames are kept, only the extension changes." }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://getcompressly.com/png-to-webp#faq",
      "mainEntity": [
        { "@type": "Question", "name": "Does converting PNG to WebP keep transparency?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. WebP carries a full alpha channel, so a transparent PNG stays transparent. Nothing is flattened onto a white background." } },
        { "@type": "Question", "name": "How much smaller will my files be?", "acceptedAnswer": { "@type": "Answer", "text": "Lossless WebP is usually 20–30% smaller than the PNG. Lossy WebP is often 60–80% smaller with no difference you can see on screen." } },
        { "@type": "Question", "name": "Is there a file-size or batch limit?", "acceptedAnswer": { "@type": "Answer", "text": "The free tier handles up to 20 files per batch at 25 MB each. Pro raises the cap to 200 MB and removes the batch limit." } },
        { "@type": "Question", "name": "Do I need to install anything?", "acceptedAnswer": { "@type": "Answer", "text": "No. It runs entirely in the browser tab you already have open. Nothing to download, nothing to sign up for." } }
      ]
    }
  ]
}
```

Notes:
- Every HowTo step and FAQ string above is the **current visible text** of `/png-to-webp` (`<ol class="steps">` and `.faq details`). Do the same copy-sync for the other four pages using each page's own visible text.
- Breadcrumb item 1 renamed to "Home" to match the visible crumb; alternatively change the visible crumb to "Compressly" — either way, make them identical.
- `WebPage.about → #software` and `isPartOf → #website` are what tie the five tool pages to the product entity; today they are orphan pages from an entity-graph point of view.
- HowTo `image` and WebPage `primaryImageOfPage` intentionally left out until a real image exists.

### Implementation and testing
1. Homepage: replace the three `<script type="application/ld+json">` blocks in `index.html` `<head>` with block A. Keep it in the static head (as now) — never inject via React.
2. Landing pages: replace the three blocks in each `public/*.html` with the block-B pattern.
3. Before publishing: add `public/og.png` (1200×630) and `public/logo.png`; set `VITE_LS_CHECKOUT_URL` in the Pages build environment.
4. Validate with Google Rich Results Test (breadcrumb + software app) and validator.schema.org; run the FAQ/HowTo text-parity check again after any copy edit.

---

## Priority Actions

1. **[CRITICAL] Sync FAQPage and HowTo text to the visible page on all 5 landing pages.** 0/20 FAQ answers match today. This is a Google policy violation and undermines AI trust in every other block. Static HTML copy job — no code change.
2. **[CRITICAL] Add real `og.png` / `logo.png` and fix the placeholder Lemon Squeezy checkout URL.** `og:image` is a soft-404 on all 6 pages, so no image property can be added to any schema; the $39 Pro Offer in schema points at an unpurchasable product until `VITE_LS_CHECKOUT_URL` is set.
3. **[HIGH] Add an Organization node (`#organization`) and wire `@id` references** from WebSite, SoftwareApplication and every landing-page WebPage. Populate `sameAs` progressively as Product Hunt / X / GitHub profiles go live — never with placeholder or dead URLs, and no Wikipedia/Wikidata.
4. **[HIGH] Enrich SoftwareApplication** — co-type `WebApplication`, add `featureList`, `isAccessibleForFree`, `softwareVersion`, `browserRequirements`, named Offers with `availability`/`url`. **Keep `aggregateRating`/`review` out** until third-party-verifiable reviews exist; the block will become rich-result eligible at that point without any fabrication.
5. **[MEDIUM] Make homepage content visible without JavaScript** (prerender at build, or a static fallback inside `#root`) and render all FAQ answers in the DOM (`<details>` instead of conditional render). Also add the 2 missing FAQs to the homepage schema, add `speakable` on landing-page WebPage nodes, and align breadcrumb "Compressly"/"Home".
