# Foundation scoped release candidate

Base: b26773e82d001cf614add4d18db614d268b0259f.

This subset of the full integrity candidate contains complete donor history across
customer records/pages, captured-minus-refunded totals by currency, correct display
precision, a truthful recurring-subscription summary, billing-account ownership
validation, canonical checkout/billing return URLs, EUR checkout validation and
explicit customer creation for one-time gifts.

It requires no new schema, credential, environment variable or provider setup.
Canonical redirects use existing NEXT_PUBLIC_SITE_URL (or the existing foundation
apex fallback); confirm that configuration before releasing. No live Stripe calls,
donations, messages or provider transactions were made during verification.

Deliberately deferred to full draft PR66: single-use link storage, purpose-separated
portal tokens and durable-intake enforcement. Existing portal auth, email and intake
code is retained in this subset so the absent new token ledger does not interrupt
sign-in. Those pre-existing vulnerabilities and delivery limitations remain; this
is not a claim of complete security or launch readiness. Merge/reconcile PR66 after
its separately reviewed schema/permission/concurrency and configuration gates.

Validation:42 tests across6 files, typecheck and lint. Release build remains to be
verified. Existing dependency security PRs and mobile validation PR56 are preserved.
Branch-specific deployment exclusions prevent automatic release on publication;
a separately verified staged deployment is required before production promotion.
