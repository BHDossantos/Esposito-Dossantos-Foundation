# Real-world information needed

The website is complete and polished, but a few things must be **real** —
they cannot be invented. This is a real foundation, so we never put made-up
names, numbers, logos, or registration details on the site.

**How to use this file:** fill in any line you can (even roughly), then tell
Claude "the real-world info is updated" — Claude will wire each item into the
site across all four languages (English, Portuguese, Italian, Spanish). You can
also just paste the facts in chat instead of editing here.

Until a value is filled in, the site keeps its current honest placeholder
(e.g. "Registered nonprofit organization", and impact figures clearly labeled
as *5-year goals*, not results). The daily improvement agent will **not** fill
these in — it leaves them for you.

---

## 1. Legal identity  (footer + Transparency/About pages)
- Registered legal name: `____`
- Country of registration: `____`
- Charity / nonprofit registration number (or EIN/equivalent): `____`
- Legal form (e.g. foundation, association, 501(c)(3)): `____`
- Year established: `____`  _(site currently says 2025 — confirm or correct)_

## 2. Leadership & board  (About page)
For each person: name, role/title, one-line bio, and a photo if available.
- Founder & President: `Bruno Dossantos` — bio: `____` — photo: `____`
- Board / advisory members:
  - `____`
  - `____`

## 3. Partners & sponsors  (Partners page)
Only organizations that have actually agreed to be listed. Name + logo file +
link, and permission to display.
- `____`

## 4. Impact numbers  (Home + Impact pages)
Replace the labeled *5-year goals* with real figures **only once true**.
- Students supported: `____`
- Scholarships funded: `____`
- Community programs: `____`
- Partners: `____`
- Countries: `____`
- (Leave blank to keep showing them as goals.)

## 5. Contact details  (Contact + footer)
- Public email(s): `____`  _(site currently uses info@ / press@harmonia-foundation.org)_
- Phone (optional): `____`
- Mailing address (optional): `____`

## 6. Photography & media
Real photos of programs, events, people (with consent), and a logo file if you
have one, to replace the gradient placeholders.
- Notes / links: `____`

---

## 7. Integrations to activate later  (keys go in Vercel env vars, not here)
These make features actually work; the site runs fine without them.
- **Stripe** — live donations (`STRIPE_SECRET_KEY`, etc.)
- **Supabase** — store form/donation submissions
- **Resend** — send emails (contact, newsletter, receipts)
- **Push provider** (Firebase/OneSignal + APNs) — mobile notifications
- **Social profile URLs** — `SOCIAL_INSTAGRAM_URL`, `SOCIAL_LINKEDIN_URL`, etc.
  (render footer icons + Organization schema `sameAs` when set)

See `.env.example` for the full list and `DEPLOYMENT.md` / `APP_STORES.md`
for setup.
