# Compressly

Browser-based image compressor: JPG, PNG, WebP, AVIF, JXL — batch, in-browser, zero upload.

Replica of [CompressEasy](https://compresseasy.com/) built on [jSquash](https://github.com/jamsinclair/jSquash) (Squoosh's WASM codecs).

## Stack

- **React 18 + Vite + TypeScript** — SPA shell
- **jSquash** — MozJPEG / OxiPNG / libwebp / libavif / libjxl, all WASM
- **Web Worker pool + Comlink** — parallel compression across CPU cores
- **Tailwind v4** — styling
- **JSZip + FileSaver** — batch ZIP download
- **Lemon Squeezy** — Pro license ($39 one-time)
- **Cloudflare Pages** — hosting (free tier, unmetered bandwidth, perfect for WASM-heavy static)

## Run locally

```bash
cp .env.example .env             # then paste your LS checkout URL
npm install
npm run dev                       # http://localhost:5173
```

You need a recent Node (18+). The dev server sets COOP/COEP headers so multi-threaded WASM works.

## Build

```bash
npm run build
npm run preview                   # serve the prod bundle locally
```

## Deploy to Cloudflare Pages

1. `npm i -g wrangler` (if not already)
2. `wrangler login` — auth with your Cloudflare account
3. `npm run build`
4. `wrangler pages deploy dist --project-name=compressly`
5. In the Cloudflare dashboard → Pages → compressly → Settings → Custom domains, point `compressly.io` (or your domain) at the project.

The `public/_headers` file ships the COOP/COEP headers automatically. **Don't skip them** — without them, AVIF/JXL multi-threaded encoders silently fall back to single-threaded and lose 50-75% of their speed.

### Alternative: Vercel

```bash
npm i -g vercel && vercel
```

Add the same headers to `vercel.json`:

```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
      { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
    ]
  }]
}
```

## Set up Lemon Squeezy ($39 Pro)

1. Sign up at [lemonsqueezy.com](https://lemonsqueezy.com) — no business entity needed; they're your Merchant of Record (handle VAT, refunds, fraud).
2. Create a store. Activate test mode first.
3. Create a product → type **License Key** → price **$39 USD, one-time payment** → enable license keys with **unlimited activations**.
4. Click **Share** on the product → copy the buy link → paste into `.env` as `VITE_LS_CHECKOUT_URL`.
5. Rebuild and redeploy.
6. Buy your own product in test mode, copy the license key from the receipt email, paste into Compressly's "Have a key?" modal — confirm you see the PRO badge in the header.
7. Switch the store to live mode → done.

The activation endpoint we call is the public `POST https://api.lemonsqueezy.com/v1/licenses/activate` — no API key needed from your side.

## Domain checklist

The brand is **Compressly**. Recommended domains, in order:

| Domain | Why |
|---|---|
| `compressly.io` | dev/indie connotation, easy to brand |
| `compressly.app` | matches "tool" mental model |
| `compressly.com` | most authoritative if available |

Register through Cloudflare Registrar (at-cost pricing, no markup).

## SEO ranking strategy (no ads)

You're competing with TinyPNG (DR 90), CompressEasy, Squoosh.app. You will not outrank them on "compress png" head terms in 6 months. The wedge is **long-tail format pairs**:

- `convert png to avif online`
- `compress webp without losing quality`
- `batch jpg compressor`
- `jxl encoder online`
- `compress images for shopify`  ← your home turf
- `compress images for amazon listing`

Plan to ship 1 SEO landing per pair (`/png-to-avif`, `/compress-webp`, etc.), each with a 600-800-word how-to embedding the tool. Compressly's component architecture is already set up for this — drop the `<Compressor>` component into any route and add format presets per page.

See `/money-seo` for the full keyword research + content plan after the v1 ships.

## Project structure

```
src/
  App.tsx                 # composition: header + hero + tool + features + pricing + faq + footer
  main.tsx, styles.css    # entry + tailwind
  types.ts                # shared types + format helpers
  lib/
    worker.ts             # WASM codec dispatcher (lazy imports)
    engine.ts             # Comlink + worker pool
    license.ts            # LS activation + free/pro limits
    format.ts             # bytes / ratio helpers
  components/
    Header.tsx
    Hero.tsx
    Compressor.tsx        # main tool: dropzone + queue + settings
    SettingsPanel.tsx     # quality / format / lossless / resize / pro gates
    FileRow.tsx           # per-file card with status + save
    Features.tsx
    Pricing.tsx           # free vs pro tiers + LS checkout
    FAQ.tsx
    Footer.tsx
    LicenseModal.tsx      # paste-license dialog
public/
  _headers                # COOP/COEP + WASM MIME + cache
  robots.txt              # AI-crawler-friendly
  sitemap.xml
  favicon.svg, privacy.html, terms.html
```

## What's not in v1

- Side-by-side preview slider (planned v2)
- PWA install + service worker (planned v2)
- PDF compression (out of scope)
- Account system — license key + localStorage is enough for a client-side tool
- Server-side compression API (Pro v2 add-on)

## License

MIT for the app code. jSquash codecs are individually licensed (see [jSquash README](https://github.com/jamsinclair/jSquash#license)).
