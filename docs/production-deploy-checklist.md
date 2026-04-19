# Production Deploy Checklist

Updated: 2026-04-19

## Required environment variables

- `NEXT_PUBLIC_SITE_URL`
  - Set to the final public origin, for example `https://www.example.com`
  - Used for `metadataBase`, canonical URLs, and locale alternate URLs
- `NEXT_PUBLIC_SUPABASE_URL`
  - Public Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Public anon key used by the current app code

Use `.env.example` as the minimal template for a new environment.

## Routing and SEO checks

- Legacy public paths now permanently redirect to Thai locale routes:
  - `/` -> `/th`
  - `/about` -> `/th/about`
  - `/products` -> `/th/products`
  - `/contact` -> `/th/contact`
  - `/logistics` -> `/th/logistics`
- Verify canonical and alternate tags on:
  - `/th`
  - `/en`
  - `/zh`
  - `/zh/products`
  - `/zh/logistics`
- Confirm no internal public navigation still links to the legacy non-locale paths

## Media/CDN work before production

- Re-encode the largest assets before deploy:
  - `public/images/team-logistics.jpg`
  - `public/videos/logistics-hero-ship.mp4`
  - `public/images/pc.png`
  - `public/images/category-coconut-modal-new.png`
  - `public/images/hero-logistics.jpg`
  - `public/images/marketing-world-map.png`
  - `public/images/home-hero-durian-v2.jpg`
- Target budgets:
  - LCP hero images under `250 KB` compressed on desktop
  - Decorative background video should not block first paint
  - Replace PNG with JPEG or WebP where transparency is not required
- CDN strategy:
  - Put images and video behind a CDN with Hong Kong edge coverage
  - Keep immutable caching for versioned static assets
  - Validate cache behavior for HTML, images, and video separately

## Alibaba Hong Kong validation

- From the Alibaba Hong Kong server, measure latency to:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - the final public origin
  - media asset URLs after CDN is configured
- Compare:
  - cold-cache page load
  - warm-cache page load
  - first visit to `/zh` and `/zh/logistics`
- Check response headers:
  - `cache-control`
  - redirect status codes for legacy routes
  - canonical link output

## Mainland China test pass

- Test from at least:
  - Guangzhou
  - Shenzhen
  - Shanghai
  - Beijing
- Record:
  - DNS lookup time
  - TLS handshake time
  - TTFB
  - LCP
  - hero image/video fetch timing

## Pre-deploy commands

```bash
npm run build
node node_modules/typescript/bin/tsc --noEmit
```

## Recommended next step

Install media tooling on the build workstation before the next round so the oversized assets can be re-encoded safely:

- `ffmpeg` for `mp4`
- `ImageMagick` or a WebP-capable image pipeline for hero images
