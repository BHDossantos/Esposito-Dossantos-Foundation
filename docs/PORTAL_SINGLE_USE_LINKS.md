# Single-use donor portal links

Local candidate only. No Supabase schema, credentials, permissions, provider
settings or deployments were changed. This extends the integrity candidate.

Magic tokens now include a signed random nonce. The callback validates signature,
purpose and expiry, then inserts a SHA-256 digest of the decoded signed token into
`portal_consumed_tokens`. Only a confirmed HTTP 201 permits a session cookie. The
primary key arbitrates competing requests, including separate server instances.
There is no read-before-write, upsert, automatic retry or process-local replay
cache. Different base64 spellings map to the same digest. Storage contains no
mailbox address or bearer token. Existing purpose-bound session cookies remain
stateless; previous magic links without a nonce are rejected after deployment.

An outage, missing schema/permission, timeout or unexpected response fails closed
with HTTP 503 and no cookie. A duplicate insert returns the invalid-link redirect.
If the insert committed but its response or the browser response was lost, the
link is consumed: request another link. A second expiry check prevents a slow
insert from extending the token lifetime. A mail security scanner that follows
the callback can consume a link; a user-confirmed POST redemption interstitial
is a possible follow-up if scanning causes real delivery failures.

## Required rollout gates (not performed here)

1. Review and apply the `portal_consumed_tokens` portion of `supabase/schema.sql`
   to the intended database through the separately approved schema process.
   It enables RLS, revokes all table privileges from PUBLIC, anon, authenticated
   and service_role, and grants service_role INSERT only. No public RLS policies
   are added. Review existing objects/policies if this table already exists;
   `CREATE TABLE IF NOT EXISTS` does not validate an existing schema.
2. On an isolated Supabase test project/local stack, POST a synthetic 64-character
   hash through the service-role REST endpoint: expect 201 once, then 409. Send
   concurrent identical inserts from independent clients: exactly one 201, all
   others 409. Restart clients and confirm the same digest still returns409.
   Confirm anon/authenticated cannot read or write the table and service_role
   cannot update/delete/read it. Verify missing-table/permission/network failures
   do not create portal cookies. Use synthetic values, never actual tokens.
3. Configure existing server-only SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
   Set PORTAL_ONE_TIME_LINKS_READY=true only after those checks pass. It defaults
   false: requests and callbacks refuse sign-in until explicitly enabled.
4. Deploy only through a separately approved release process and verify the real
   email -> first callback -> session -> rejected replay flow. Existing valid
   sessions do not require this storage path.

The table is append-only for the application. Plan privileged cleanup of rows
whose expiry is safely past, with a clock-skew margin; do not remove unexpired
rows. All app instances must use the same authoritative database and synchronized
clocks. Restoring older ledger backups may re-enable recently consumed links:
stop sign-in until all potentially affected magic links have expired (15 minutes
plus clock skew), or invalidate signing material through an approved procedure.
That procedure can also invalidate session cookies. Do not serve a stale replica
or restore old ledger data while accepting affected links.

## Validation and limits

Automated application tests cover 20 simultaneous callbacks, replay after module
reload and alternate base64 encoding, nonce uniqueness, expiry, session-purpose
rejection, missing readiness, storage errors and ambiguous commits. Their storage
adapter is an explicit unique-insert contract double. It is not a PostgreSQL or
Supabase integration test and does not prove deployed schema/permissions. Neither
PostgreSQL nor Supabase CLI was available here; no remote storage was accessed.
Real database concurrency/RLS checks above remain a release blocker. Sign-in
rate limiting and individual session revocation are still separate remaining work.

References reviewed: [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api),
[PostgREST insert behavior](https://docs.postgrest.org/en/stable/references/api/tables_views.html).
