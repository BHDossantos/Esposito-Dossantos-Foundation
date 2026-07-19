# Deployment

This repo ships two GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`) — runs `typecheck`, `lint`, and `build` on every
  push and pull request. No secrets needed; this gives you green PR checks immediately.
- **Deploy** (`.github/workflows/deploy.yml`) — deploys to **Vercel**:
  - **Preview** deploy on every PR / branch push, with the live URL posted as a PR comment.
  - **Production** deploy on push to `main`.

The deploy job stays **skipped** (neutral, not failing) until you opt in. Here's the
one-time setup to get a live link.

## One-time Vercel setup (~3 minutes)

### 1. Create the Vercel project

1. Go to <https://vercel.com/new> and import this GitHub repo
   (`BHDossantos/Esposito-Dossantos-Foundation`).
2. Framework preset: **Next.js** (auto-detected). Click **Deploy** once to create the
   project. You can disable Vercel's own Git integration afterward if you prefer the
   Action to own deploys — either is fine.

### 2. Get the three identifiers

- **`VERCEL_TOKEN`** — create at <https://vercel.com/account/tokens>.
- **`VERCEL_ORG_ID`** and **`VERCEL_PROJECT_ID`** — in the project's
  **Settings → General**, or run `npx vercel link` locally and read
  `.vercel/project.json`.

### 3. Add them to GitHub

In the repo: **Settings → Secrets and variables → Actions**.

Under **Secrets**, add:

| Name | Value |
| --- | --- |
| `VERCEL_TOKEN` | your Vercel token |
| `VERCEL_ORG_ID` | your org/team id |
| `VERCEL_PROJECT_ID` | your project id |

Under **Variables**, add:

| Name | Value |
| --- | --- |
| `ENABLE_VERCEL_DEPLOY` | `true` |

### 4. Re-run the workflow

Push any commit (or re-run the latest **Deploy** run). The PR will get a comment with
your preview URL, and `main` will publish to your production domain.

## Environment variables in production

Add the keys from `.env.example` (Stripe, CRM, etc.) in **Vercel → Settings →
Environment Variables** as you wire up each integration.

## Alternative: Cloudflare Pages

This app uses middleware (for locale routing), so it needs an SSR-capable host —
Vercel is the simplest. Cloudflare Pages also works via
[`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) if you
prefer Cloudflare; ask and I'll add that workflow instead.
