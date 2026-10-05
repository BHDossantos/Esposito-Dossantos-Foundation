# Esposito–Dossantos Foundation

> **Empowering Lives. Inspiring Futures.**

A premium, investor-grade nonprofit platform for the Esposito–Dossantos Foundation —
a global foundation empowering individuals and communities through **education, music,
technology, culture, mentorship, and opportunity**.

This repository contains the Phase 1 MVP marketing site with **full multilingual
support** in **English, Portuguese, Italian, and Spanish**.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | [next-intl](https://next-intl.dev) |
| Fonts | Cormorant Garamond (serif) + Inter (sans) |
| Hosting (target) | Vercel + Cloudflare |

## Internationalization

- Locales: **`en` (default), `pt`, `it`, `es`** — defined in `src/i18n/routing.ts`.
- URL strategy: `localePrefix: 'as-needed'` — English serves at `/`, others at
  `/pt`, `/it`, `/es`.
- All copy lives in `messages/<locale>.json`. Every locale file is **key-for-key
  identical** (707 keys) — verified during build.
- A language switcher lives in the header; locale persists across navigation.
- `sitemap.ts` emits `hreflang` alternates for every page in every language.

### Adding or editing copy

1. Edit `messages/en.json` (the source of truth).
2. Mirror the same keys in `pt.json`, `it.json`, and `es.json`.
3. Run `npm run build` — the build fails fast if a message is missing.

### Adding a new language

1. Add the code to `locales` and `localeNames` in `src/i18n/routing.ts`.
2. Create `messages/<code>.json` with the full key set.

## Project structure

```
src/
  app/
    [locale]/        # localized routes (home, mission, programs, impact,
                     # events, donate, partners, about, contact, legal…)
    sitemap.ts       # multilingual sitemap with hreflang
    robots.ts
  components/        # Header, Footer, sections/, forms/, UI primitives
  i18n/              # next-intl routing, request config, navigation helpers
  lib/               # nav config, metadata helper
messages/            # en / pt / it / es translation catalogs
```

## Pages (Phase 1)

Home · Mission · Programs · Impact · Events · Donate · Partners · About ·
Contact · Privacy · Terms · Cookies

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in integration keys as needed
npm run dev                  # http://localhost:3000
```

Scripts:

```bash
npm run dev        # development server
npm run build      # production build (validates i18n + types)
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest unit tests (i18n parity, auth, schemas, content)
```

Security headers (CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) are applied to every route in
`next.config.mjs`.

## Integration points (wired as placeholders)

The MVP ships with conversion-ready UI. Connect these services via `.env.local`:

- **Donations** — `DonateForm` is ready for Stripe / PayPal / Apple Pay / Google Pay
  checkout and recurring gifts.
- **CRM / leads** — `ContactForm` and `NewsletterForm` are structured for HubSpot /
  Salesforce / Airtable / Supabase with lead categories (donor, sponsor, volunteer,
  artist, student, school, media, grant).
- **Bot protection** — Cloudflare Turnstile / reCAPTCHA keys are scaffolded.

## Accessibility & SEO

- Semantic landmarks, skip-to-content link, keyboard-navigable menus, reduced-motion
  support, WCAG-minded color contrast.
- Per-page metadata, Open Graph, JSON-LD `NGO` schema, multilingual sitemap & robots.

## Roadmap

- **Phase 2** — Impact dashboard, events/RSVP system, volunteer & scholarship portals,
  grant tracker, sponsor portal, AI agent dashboard, blog/news.
- **Phase 3** — Donor/sponsor logins, annual report generator, automated email
  sequences, public transparency dashboard, global chapter pages.
