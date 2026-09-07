# GEO Content Quality & E-E-A-T Analysis — getcompressly.com

Date: 2026-09-04 · Subagent: geo-content · Scope: 5 static landing pages + homepage + privacy/terms
Fetch: apex `https://getcompressly.com` (all 200; landing HTML byte-identical to `dist/`). Live homepage bundle `assets/index-0CeCobE2.js` also inspected.
Analysis only — no site files modified.

---

## Content Quality & E-E-A-T Score: 37/100 — Poor

**Verdict in one line:** the prose is genuinely good (clear, specific, honest, Flesch 63–76, no AI-filler phrasing) but it sits on a site with almost no E-E-A-T scaffolding — no author, no About, no evidence, no citations, no reviews, no dates, a hub page that is invisible to non-JS crawlers, and a live "Get Pro — $39" button that links to a placeholder store. Word count is *not* the main gap; identity, evidence and breadth are.

### Score composition (agent methodology weights)

| Component | Raw | Weighted | Note |
|---|---|---|---|
| Experience | 7/25 | 4.2/15 | Product-specific numbers, honest trade-offs; zero screenshots, zero original data, no first-person |
| Expertise | 8/25 | 4.8/15 | Correct terminology and nuance; no author, no credentials, 3 factual overreaches, 0 citations |
| Authoritativeness | 3/25 | 1.8/15 | Day-old domain, no About, no sameAs, 5 pages on a narrow slice of the topic |
| Trustworthiness | 10/25 | 6.0/15 | HTTPS, dated privacy/terms, transparent pricing; but placeholder checkout, obfuscated email, schema≠visible FAQ, broken og:image |
| Content metrics | 9/15 | 9 | 609–682 body words (short-form), excellent readability, clean H1/H2, 9–10 internal links, 0 external links, 0 images |
| AI-content assessment | 6/10 | 6 | Likely human-edited AI: distinct voice, no clichés, but one template cloned 5× |
| Topical authority | 3/10 | 3 | Thin: 5 spokes, hub not server-rendered; AVIF/JXL/PNG/JPG pages missing |
| Freshness | 2/5 | 2 | No visible or structured dates on landing pages |
| **Total** | | **36.8 → 37/100** | E-E-A-T subtotal 28/100 |

---

## Pages analyzed

Body = hero + article (header/footer excluded). Citability = `citability_scorer.py` average across blocks (0–100).

| Page | Body words | Prose / FAQ | Flesch | Avg para (max) | Headings | Int / Ext links | Images | Citability | Rating |
|---|---|---|---|---|---|---|---|---|---|
| /png-to-webp | 682 | 585 / 117 | 75.8 (Fairly easy) | 37 (73) | H1×1, H2×7 | 9 / 0 | 0 | 52.5 (B×1 C×3 D×2) | Medium |
| /jpg-to-webp | 642 | 546 / 94 | 75.4 | 35 (65) | H1×1, H2×7 | 9 / 0 | 0 | 50.3 (B×1 C×2 D×3) | Medium |
| /webp-to-png | 615 | 518 / 91 | 62.8 (Standard) | 33 (70) | H1×1, H2×7 | 10 / 0 | 0 | 42.7 (C×3 D×2 F×1) | Low-Med |
| /webp-to-jpg | 609 | 511 / 85 | 72.5 | 33 (73) | H1×1, H2×7 | 9 / 0 | 0 | 37.8 (C×2 D×1 F×3) | Low |
| /compress-webp | 637 | 547 / 108 | 73.9 | 35 (74) | H1×1, H2×7 | 10 / 0 | 0 | 39.2 (C×3 F×3) | Low |
| / (homepage) | **13** (SSR) | — | — | — | none in HTML | 0 | 0 | n/a | **Not assessable** |
| /privacy.html | 142 | dated 2026-05-28 | — | — | H1 + 4 H2 | 2 / 1 | 0 | — | Trust page OK |
| /terms.html | 122 | dated 2026-05-28 | — | — | H1 + 5 H2 | 2 / 0 | 0 | — | Trust page OK |

Readability note: Flesch is estimated from all article prose per page (37–40 sentences, 12–14 words/sentence). All five sit in or above the 60–70 web target; no wall-of-text paragraphs (max 74 words). This dimension needs no work.

Heading structure (identical skeleton on all 5): `H1 Convert X to Y` → `H2 Why …` → `H2 … in three steps` → `H2 X vs Y` (table) → `H2 privacy` → `H2 More conversions` → `H2 Questions` → `H2 Ready to convert?`. One H1, no skipped levels, no H3s. Clean, but the "Ready to convert?" CTA is an H2 with 10 words of content — it dilutes the outline for extractors.

---

## Depth vs. what actually ranks (Ahrefs SERP, US, 2026-09-04)

Fetched the organic top-10 for each keyword and counted visible words (Adobe/Canva/Shutterstock blocked bots; excluded).

| Keyword | Vol / KD | AI Overview? | #1 (DR, main words) | Top-10 median words | Deepest pages | Compressly | Ours ÷ median | Words to median | Words to citation-grade (≈1,750) |
|---|---|---|---|---|---|---|---|---|---|
| png to webp | 8,700 / 26 | No (PAA ×4) | CloudConvert (82, **142**) | 782 | Cloudinary 1,854 · FreeConvert 1,698 | 682 | 0.87 | +100 | +1,050 |
| jpg to webp | 6,100 / 35 | **Yes** (cites Convertio, Ezgif) | CloudConvert (82, 143) | 911 | Cloudinary 2,317 · FreeConvert 1,696 | 642 | 0.70 | +270 | +1,100 |
| webp to png | 163,000 / 30 | **Yes** (+ PAA ×4) | CloudConvert (82, 142) | 734 | Cloudinary 1,864 · FreeConvert 1,783 | 615 | 0.84 | +120 | +1,150 |
| webp to jpg | 103,000 / 39 | **Yes** (cites CloudConvert, Adobe, iLoveIMG, FreeConvert, MS Community) | CloudConvert (82, 143) | 792 | FreeConvert 1,752 | 609 | 0.77 | +180 | +1,150 |
| compress webp | 450 / 0 | No (PAA ×4) | TinyPNG (90, 2,221) | 672 | TinyPNG 2,221 · Cloudinary 1,832 | 637 | 0.95 | +35 | +1,100 |

**What this says about the "word count" thesis**

1. The #1 result for 4 of 5 keywords is CloudConvert with ~140 words of content. It wins on DR 82, 94–322 referring domains per URL, and tool utility — not on depth. Length is not the primary ranking lever here.
2. Top-10 domain ratings run 62–96. A domain launched today will not out-rank them on any amount of text; the realistic near-term win is **AI citation** (AI Overviews are live on the three highest-volume queries) and long-tail PAA questions, and *those* reward answer-shaped depth.
3. On raw length Compressly is already at 70–95% of the median; the gap to median is 35–270 words per page — trivial. The gap to the citation-grade tier (FreeConvert/Cloudinary/TinyPNG at 1,700–2,300 words) is ~1,050–1,150 words per page, and that tier gets cited because it contains question-shaped sections, benchmark numbers and screenshots, not because it is long.
4. So: **the remaining gap is not word count; it is (a) evidence, (b) identity, (c) breadth, (d) four trust bugs.** Adding 1,000 words of generic prose per page would move the score by perhaps +5; adding an original benchmark block, an author, an About page and 6 more format pages would move it by +25–30.

Recommended target: 1,200–1,500 body words per page (+550–900), composed only of the blocks listed under Priority Actions.

---

## Findings, ordered by funnel: found → read → cited → enough

### 1. Found (can a crawler/LLM see the content at all?)

- **Homepage serves 13 server-rendered words.** Hero, 6 feature cards, pricing tiers, 8 FAQs, footer contact email and the five converter links exist only in `index-0CeCobE2.js`. The one page that defines the brand entity ("Compressly is a browser-based image compressor…") is invisible to non-JS fetchers, which is how most AI retrieval works. Only the head JSON-LD (SoftwareApplication, WebSite, FAQPage) is visible — and it carries a factual error (below).
- **Soft-404s masquerade as pages:** `/about`, `/blog`, `/llms.txt`, `/og.png`, `/apple-touch-icon.png`, `/faq`, `/pricing` all return 200 with the 6,047-byte SPA shell. Consequence for content: og:image on all 6 indexable pages points at an HTML document (social/AI preview cards broken), and there is no About page to discover. (Mechanics belong to the technical agent; the content consequence is recorded here.)
- No dates anywhere in landing-page HTML (`datePublished`/`dateModified`/visible "Updated" all absent). Sitemap lastmod 2026-07-24.

### 2. Read (is what they see readable and accurate?)

- Readability is a strength: Flesch 63–76, 12–14 words/sentence, paragraphs 33–37 words, no jargon without context, zero generic-phrase hits ("delve", "in today's…", "seamless", etc. — none).
- Voice is a strength: "PNG vs WebP, honestly", "makes the file boring in the best way", "one honest caveat". Second-person throughout (15–19 you/your per page), zero first-person — there is no "we" because there is no one behind the site.
- **Accuracy issues (all in server-rendered content unless noted):**
  1. Homepage FAQPage JSON-LD (+ client FAQ): "Compressly uses **Google's** MozJPEG…" — MozJPEG is Mozilla's project.
  2. Homepage FAQPage JSON-LD: "TinyPNG … **only supports JPG/PNG/WebP**" — TinyPNG's own og:title today is "Compress AVIF, WebP, PNG and JPEG images" (115 AVIF mentions on its homepage). False competitor claim in structured data that AI engines will read.
  3. /png-to-webp: "the same MozJPEG, libwebp and libavif projects **the browsers themselves use**" — browsers decode JPEG with libjpeg-turbo, not MozJPEG. /webp-to-png: "the same libwebp and OxiPNG projects **the browsers rely on**" — no browser uses OxiPNG. Both are overreach; "the same codecs Squoosh uses" is the accurate line (and Hero.tsx already says it correctly).
  4. Homepage FAQ: "JPEG XL … better compression than AVIF at higher fidelity" — contested; stated as fact with no source.
  5. Client-only footer: "Compresses image — not your privacy." (typo; landing pages have the correct "your images").
  6. Numbers that are right but unsourced: 20–30% lossless / 25–35% lossy match Google's WebP page (26% vs PNG; 25–34% vs JPEG). Link it — it is the single most authoritative citation available and costs one `<a>`.
- **FAQ schema does not match visible FAQ text on 17 of 20 questions** (question wording differs on 17; answer text differs on all 20; on /png-to-webp and /jpg-to-webp two of the four schema questions do not appear on the page at all). Google's FAQ rich-result guidance requires the marked-up Q&A to be visible on the page; LLM extractors also lose confidence when the two disagree.
- Contact email on /privacy.html and /terms.html is Cloudflare-obfuscated (`[email protected]` + `email-decode.min.js`); a non-JS reader cannot see `hello@getcompressly.com`. The plain address lives only in the client-rendered homepage footer.

### 3. Cited (is there something worth quoting, and can it stand alone?)

- Citability scorer: page averages 37.8–52.5; **0 passages in the 134–167-word optimum**; best blocks are the "Why …" intros (168–190 words, grade B/C). FAQ answers are 14–28 words — too short to be lifted as a standalone answer (target 40–80).
- Hero subtitles are the weakest blocks (score 15–38): promotional, no definition, no entity name. First sentence of the page should be a definitional answer ("Converting PNG to WebP re-encodes a lossless PNG into Google's WebP format, typically cutting file size 26% (lossless) or 60–80% (lossy) while keeping the alpha channel.")
- Nothing on any page is *unique to Compressly*: every number is a general WebP fact any competitor can state. There is no original benchmark, no screenshot, no named person, no date, no changelog. An LLM has no reason to cite this domain over Cloudinary for the same sentence.
- The one differentiator with citation potential — "verify it in DevTools › Network, no image request fires" — is a strong, checkable, first-hand claim. It should be a screenshot with alt text, not a sentence.
- Most-citable existing passages: /png-to-webp "Why move PNG to WebP" (¶3, the two-number summary); /jpg-to-webp "Why convert JPG to WebP" (¶3, the honest lossy-re-encode caveat); /webp-to-png ¶3 ("converting to PNG will not sharpen it"); /webp-to-jpg ¶3 (transparency fill + size caveat); /compress-webp ¶2 (q90→q75 explanation). These five are the seeds — keep them, lead with them, and put the numbers in a table.

### 4. Enough (depth, breadth, identity)

- Depth: see table above. Per page, the missing blocks are: PAA answers, a benchmark table, a "when NOT to convert" section, a settings-explained section (quality slider semantics, lossless vs lossy, effort), and a "how to open/verify the result" section.
- Breadth: the tool encodes JPG/PNG/WebP/AVIF/JXL in any direction and the free tier already includes AVIF, yet the site has 5 pages, all WebP-centric. Missing obvious spokes: compress-png, compress-jpg (highest-volume terms in the category), png-to-avif, jpg-to-avif, avif-to-jpg, avif-to-png, webp-to-avif, jxl-to-jpg / jpg-to-jxl, heic-to-jpg (very high volume, if decode is feasible), bulk/batch converter, image resizer. Competitors have 50–500 such pages; topical authority is built there.
- Identity: no About page, no author byline, no Person/Organization schema with `sameAs`, no GitHub/X link, no changelog, no "built on jSquash by …". The footer line "Built on jSquash and the Squoosh codec family" (client-only) is the closest thing to provenance on the site.
- Trust: zero reviews/testimonials (the fake aggregateRating was correctly removed — do not reintroduce without real reviews). 
- **The live "Get Pro — $39" button links to `https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`** (present in the live bundle; `.env` absent at build). The SoftwareApplication schema advertises a $39 offer, the pricing section promises "Buy once, use forever", and the link resolves nowhere. This is the single largest trust defect on the site and it is a build-config fix, not a content one.

---

## E-E-A-T detail

**Experience (7/25).** Present: product-specific caps (20 files / 25 MB free; 200 MB Pro), practical quality guidance (q75 default, 80–85 portraits, 60–70 thumbnails), acknowledged trade-offs on every page, a verifiable "watch the network tab" claim. Absent: any screenshot or artifact (0 images on 5 pages), any before/after with real file sizes, any "we tested N images" statement, any failure/edge-case discussion (animated WebP? CMYK JPEG? 16-bit PNG? EXIF orientation?). The site owns a compressor and publishes no compression results.

**Expertise (8/25).** Terminology is correct and natural (alpha channel, lossy/lossless, re-encode, WebAssembly, libwebp, MozJPEG, OxiPNG). Nuance is real ("a JPG is already lossy… re-encoding can't bring that back"). But: no author byline, no bio, no Person schema, no external presence to verify; zero outbound citations; three factual overreaches about which codecs browsers use and who owns MozJPEG. Depth stops at the level of a good blog intro.

**Authoritativeness (3/25).** Domain launched today; no referring domains to speak of; no About page (soft-404); no sameAs; no media, awards, or Wikipedia; coverage is five WebP pages against competitors' hundreds. Only the README-level provenance (jSquash / Squoosh codecs) hints at lineage, and it is client-rendered.

**Trustworthiness (10/25).** Present: HTTPS; privacy policy that is specific, dated and honest (no analytics — verified: no GA/GTM/Plausible/PostHog/Sentry strings in the bundle); terms with a 14-day refund; Lemon Squeezy as Merchant of Record disclosed; clear free/Pro pricing; fake rating removed. Absent/broken: placeholder checkout URL; contact email obfuscated on the only two pages that carry it; no ownership (no company or person named anywhere); no dates on content pages; FAQ schema ≠ visible text; og:image broken; two false statements in homepage FAQ schema.

---

## AI-content assessment

**Assessment: Likely human-edited AI (or human writing to a template).** Evidence for quality: zero generic-phrase hits across ~2,700 words of prose; opinions expressed ("WebP is the format that earns its keep"); trade-offs acknowledged on every page; concrete numbers. Evidence of template generation: identical 8-section skeleton on all 5 pages; "Is anything uploaded?" FAQ repeated 5×; "Runs locally via WebAssembly · Batch + ZIP export" trust line repeated 5×; every page has exactly 3 intro paragraphs, 3 steps, 1 callout, 1 four-row table, 4 FAQs. No original data on any page. Not a penalty risk in itself — the risk is that five near-identical pages give an LLM five near-identical low-uniqueness candidates.

---

## Topical authority

**Assessment: Thin.** 5 spoke pages, fully cross-linked (each links to all 4 siblings + home, descriptive anchors — good). Hub page (homepage) is not server-rendered, so the hub-and-spoke structure is invisible in HTML. No blog, no glossary, no comparison pages.

PAA questions Google is showing on these SERPs that no Compressly page answers: "Is WebP better quality than PNG?", "Is it safe to convert PNG to WebP?", "Why is my PNG saving as a WebP?", "What are the disadvantages of using WebP?", "What is the difference between PNG and WebP?", "How do I open a WebP file?", "Why do my files keep saving as WebP?", "How can I compress a WebP file?", "How to reduce WebP size?", "Is WebP better than JPEG?". Each is a ready-made H2.

---

## Freshness

| Page | Published | Last updated | Status |
|---|---|---|---|
| 5 landing pages | Not visible | Not visible (sitemap lastmod 2026-07-24) | No date — flag |
| /privacy.html, /terms.html | — | 2026-05-28 (visible) | Current |
| / | Not visible | — | No date |

Topic is semi-evergreen (format facts stable; browser support and tool comparisons drift). Add visible "Updated" + `dateModified` and keep the comparison claims (TinyPNG, Squoosh) reviewed quarterly.

---

## Priority actions

1. **[CRITICAL] Fix the Pro checkout link.** Set `VITE_LS_CHECKOUT_URL` at build and redeploy; until then the $39 offer in schema, pricing and header points at `YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID`. (Config, ~5 min; also unblocks revenue.)
2. **[CRITICAL] Make the homepage's brand-defining content server-visible and correct.** Pre-render (or ship static fallback markup inside `#root`) for hero, features, pricing, FAQ and footer; fix "Google's MozJPEG" → Mozilla, drop or correct the TinyPNG format claim, hedge the JXL-vs-AVIF claim, fix the footer typo. Add Organization schema with `sameAs`, plain-text contact email, and a real `/about` (who builds it, jSquash/Squoosh lineage, changelog).
3. **[HIGH] Add evidence to every landing page.** One original benchmark block: 5 named sample images (photo, screenshot, logo w/ alpha, gradient, line art) → before/after KB at q75, q85, lossless, with encoder version and date; plus 2 screenshots with descriptive alt (the tool mid-batch; DevTools Network tab showing no upload). This is the cheapest strong Experience signal and none of the top-10 pages publish real numbers.
4. **[HIGH] Expand each page to 1,200–1,500 words with answer-shaped blocks, and align schema with the page.** Add H2s for the PAA questions listed above; lengthen FAQ answers to 40–80 words; lead each page with a definitional sentence; link Google's WebP documentation for the 26% / 25–34% figures; make FAQPage and HowTo JSON-LD text identical to the visible text; add author byline + visible "Updated" date + `dateModified`.
5. **[HIGH] Build breadth where the tool already has capability.** compress-png, compress-jpg, png-to-avif, jpg-to-avif, avif-to-jpg, avif-to-png, webp-to-avif, jpg-to-jxl (Pro), plus a bulk-converter page. Same template, but each with its own benchmark block. Ten to twelve pages moves topical authority from "Thin" to "Emerging".

Medium: turn the "Ready to convert?" H2 into a `<p>`/`<aside>` so the outline is 100% informational; hedge "browsers use MozJPEG/OxiPNG" → "the same codecs Squoosh uses"; fix og:image; consider a real testimonial section only once real users exist.

---

## Method notes

- Word counts: BeautifulSoup text extraction, header/footer/script excluded for Compressly; competitors counted on full visible text and on `<main>`/`<article>` where present. Adobe, Canva and Shutterstock blocked the fetcher and are excluded from medians.
- Readability: Flesch Reading Ease computed over all article prose per page (heuristic syllable counter; ±5 points).
- Citability: `~/.claude/skills/geo/scripts/citability_scorer.py` on live URLs.
- SERP/keyword data: Ahrefs `serp-overview` + `keywords-explorer-overview`, US, 2026-09-04 (~1,690 API units).
- E-E-A-T is scored on observable signals only. AI-content assessment is a likelihood statement, not a determination.
- Working files: `/private/tmp/claude-501/-Users-j/ff2480b3-8681-461f-95b9-b48d3fd6740d/scratchpad/` (`pages/*.html`, `metrics.json`, `serp_wordcounts.json`, `live-bundle.js`).
