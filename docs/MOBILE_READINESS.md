# Mobile readiness — 2026-11-02

Status: native shell validation improved; **not store-ready**.

## Fixed in this branch

- Lock Capacitor CLI and asset tooling in npm; use Node 22 and Java 21.
- Run mobile contract tests, generated Android debug validation and unsigned iOS
  simulator validation in a PR workflow. Capacitor 8 uses an SPM Xcode project.
- Set `server.errorPath` explicitly. A failed remote navigation now targets the
  bundled page; retry navigates to the production site instead of reloading the
  local error document. Preview builds also retry production, intentionally.
- Reject non-HTTPS server URLs and URLs containing credentials.
- Clean up the native back-button listener, including asynchronous unmount races.
- Stop requesting push permission without a working subscription/delivery service.
- Remove Codemagic publishing and swallowed errors. iOS archive configuration uses
  existing signing profiles; Android release bundle is explicitly unsigned.
- Restrict the optional Vercel workflow to main pushes, preventing PR/branch validation
  from deploying previews. No deployment or settings change was performed.

## Local checks

`npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and native project
creation/assets/sync can run without signing. Run device compilation and acceptance
checks in the appropriate SDK environment; generated native directories are ignored.

## Verification in the workspace

- Typecheck and lint passed; all 37 unit tests passed (including 5 shell tests).
- Android and iOS SPM project generation, branded assets and sync passed.
- Android compile/lint could not start: Gradle distribution download failed with
  `UnknownHostException: services.gradle.org`. No Android binary was validated.
- iOS compilation requires macOS/Xcode, unavailable in this Linux workspace.
- Next production build was blocked by Google Fonts fetch failures for Inter and
  Cormorant Garamond. No successful full web production build is claimed.

## Remaining blockers

1. Run Android compile/lint and iOS simulator jobs successfully on suitable runners,
   then test offline cold launch, failed navigation, retry, hardware back and external
   link/payment behavior on real devices. The fallback is an error page, not cached
   full application content. A remote web shell alone does not establish store acceptance.
2. Implement explicit push opt-in UI plus authenticated, per-device token enrollment,
   token refresh/removal and account revocation. Configure APNs entitlement and app
   delegate callbacks, Android FCM services, backend delivery, authorization and
   delivery receipts. No provider credentials or token service were invented here.
3. Wire Android upload signing with an existing owner-approved key. Validate iOS
   provisioning/capabilities and release archives; neither signed build was run.
4. Finish store records, ownership verification, icons/screenshots, privacy/data safety
   disclosures, account deletion/support and review/demo instructions. Verify donation
   eligibility and payment flows with the appropriate organizations and review policies.
5. Exercise application flows against an authorized staging backend and resolve any
   API/content gaps. No production access changes or store submissions occurred.

The Android/iOS CI artifacts are validation outputs, not evidence of store approval.
