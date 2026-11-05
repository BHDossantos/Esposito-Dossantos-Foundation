# Foundation integrity fixes — review candidate

Base: b26773e82d001cf614add4d18db614d268b0259f on the actual default branch
`claude/foundation-multilingual-build-9lo6tn`. Isolated branch:
`codex/foundation-integrity-20261105`. Existing PR #56 and dependency PRs are
unchanged. This candidate is not deployed or approved for release.

## Changed behavior

- Checkout, portal email links, callback redirects and billing return URLs use
  the validated canonical `NEXT_PUBLIC_SITE_URL` (default Foundation domain),
  never request Origin/Host. Canonical configuration must be an HTTPS origin;
  only non-production localhost development permits HTTP. Locale is restricted
  to the four supported languages. External, backslash and encoded-slash return
  paths are rejected.
- Portal login requires configured mail and provider acceptance. Missing or
  failed mail produces an unavailable response; tokens are never printed to
  logs. Magic tokens cannot be used as sessions and session tokens cannot be
  exchanged for renewed sessions through the magic-link endpoint.
- **Existing portal sessions and previously emailed links become invalid when
  this token-format change is deployed.** Donors sign in again. Magic links
  remain reusable within their 15-minute TTL; durable single-use consumption and
  rate limiting are not implemented by this change.
- Contact, newsletter, RSVP and application success requires the existing
  Supabase lead store to acknowledge persistence. Missing configuration,
  non-success response or storage exception now causes the existing form error
  path, without logging the submission's personal data or sending a premature
  welcome message. Email failure after storage does not undo the saved lead.
- No database schema changed. This is not exactly-once intake: a lost response
  after a successful insert followed by manual resubmission can duplicate a
  lead. Existing email sequence scheduling remains unchanged. A durable
  idempotency/outbox design is a separate operational improvement.
- Giving totals iterate all Stripe customers matching the verified normalized
  email, all their charges and subscriptions, not just one customer and the
  first 24 charges. Totals use captured amounts less refunds and are grouped by
  currency; failed/uncaptured charges do not add to totals. Portal history shows
  net amounts and refund states. Currency conversion uses ISO precision with
  Stripe's ISK/UGX charge exceptions. No FX conversions are performed.
- Any provider iteration failure returns unavailable rather than partial totals.
  A 10,000-resource interactive budget also fails closed. This is not a bank
  reconciliation or tax-receipt ledger; disputes are labeled but dispute
  accounting/settlement is not inferred from charge state.
- One-time EUR checkout explicitly creates a Stripe Customer so future gifts
  can appear in the portal. Existing UI already offers EUR only; the API now
  rejects unsupported currencies rather than multiplying every currency by 100.
  Recurring checkout behavior is otherwise unchanged. Historical guest charges
  without Customer links or with nonmatching stored emails still require
  reviewed provider reconciliation; they are not silently imported.
- Multiple matching billing accounts are available for explicit selection. The
  server checks the selected customer against the verified mailbox's current
  provider result; arbitrary customer IDs cannot open another account's portal.

## Validation

- Full local suite: 58 tests passed across 6 files.
- New regression suite against original source: 14 failures reproduced in 26 targeted cases before restoring the patched
  source. Stripe list mocks preserve both first-page promise and async-iterator
  interfaces.
- TypeScript and lint passed; diff whitespace checks passed.
- Production build attempted but blocked by environment network fetching Google
  Fonts (Cormorant Garamond and Inter). A successful build is not claimed.
- Stripe, email and storage failures are simulated. No live charge, email,
  provider credential or hosted database mutation occurred. Hosted RLS/storage,
  provider delivery and physical-device/store acceptance are unverified.

## Release gates

The branch is explicitly excluded in both repository Vercel deployment paths
(`vercel.json` Git integration and the GitHub deploy job). Those branch-only
exclusions are not changes to production deployment settings. External
integration activation has not been independently verified; no push or PR was
performed after the root agent reported draft-PR approval rejection.

Before an approved release: review token invalidation; verify canonical domain,
mail delivery and persistent lead storage; inspect RLS so browser/anonymous
roles cannot read submissions; perform test-mode checkout, refund, history and
multi-customer portal acceptance; verify backup/recovery and operational lead
follow-up. The existing Next.js/dependency security PRs must be reviewed and
validated separately. Legal entity, verified fundraising/receipt facts,
provider-account configuration and store approval remain owner decisions.

References consulted: Stripe's Node auto-pagination documentation and current
Supabase API-security documentation/changelog. Existing REST persistence
protocol/schema was not changed.

## Review follow-up: portal display accuracy

Currency formatting now uses the currency's default display precision, preserving
EUR 9.60 and BHD 1.234 rather than rounding both to integers. Rendered-page tests
check totals and history, including zero-decimal JPY. The recurring-gift summary
counts all active/trialing subscriptions and directs donors to Manage giving for
full billing details. It no longer truncates to two subscriptions or presents a
first-item unit price as the complete subscription bill; quantities, multiple
items, discounts, taxes and usage can change the amount actually charged.

Follow-up validation: 61 tests across 7 files, typecheck and lint. Production build
was not repeated; the earlier Google Fonts network failure remains unresolved.
