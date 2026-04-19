# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

**Asian Overseas Trading** — Thai fruit export corporate website with admin portal. Multi-language (TH/EN/ZH), self-hosted assets (optimized for access from mainland China via Alibaba Cloud HK).

### Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (PostCSS plugin, no separate config file)
- **Supabase** (`@supabase/supabase-js`) — PostgreSQL backend, client in `lib/supabase.ts`
- **react-simple-maps** — Interactive China logistics map

### Key Directories

- `app/` — All pages using App Router. Public routes: `/`, `/about`, `/products`, `/logistics`, `/contact`
- `app/superadmin/` — Protected admin portal: login, products, about, contact, logistics, media editors
- `components/` — Shared UI components
- `lib/locale.ts` — Custom locale system (TH/EN/ZH) with cookie-based persistence; navigation labels, brand names, and all UI copy live here
- `lib/supabase.ts` — Supabase client initialization
- `public/geo/countries-110m.json` — GeoJSON for the interactive China map

### Locale System

Locale is stored in a cookie and resolved in `lib/locale.ts`. All translated strings (nav labels, page copy, brand names) are defined per-locale in that file and in each page component. When editing any user-facing text, update all three locales (TH/EN/ZH).

### Styling

- Tailwind CSS v4 — configuration is inline in CSS, not in a separate `tailwind.config.js`
- Two color themes: default and `gold`, toggled via `data-theme` attribute on the root element
- Fonts are self-hosted via `next/font` (Prompt, Montserrat, Open Sans) — no external CDN calls

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Deployment

Alibaba Cloud ECS (Hong Kong) + PM2 + Nginx + Cloudflare DNS/SSL. All assets must remain self-hosted — no external CDN dependencies that may be blocked in mainland China.
