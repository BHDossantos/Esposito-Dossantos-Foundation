# Mobile build and release preparation

The app is a Capacitor shell loading the Foundation website, with native back
navigation and a bundled error page. Push delivery is **not implemented**. The
error page is not a full offline version of the site, and no store acceptance is
claimed. See [the current readiness report](docs/MOBILE_READINESS.md) for blockers.

- App name: Esposito–Dossantos Foundation
- Proposed bundle ID: `org.espositodossantosfoundation.app` (verify ownership)
- Remote URL: `https://espositodossantosfoundation.org`
- `CAP_SERVER_URL` accepts an HTTPS preview URL without embedded credentials.

## Local validation

Use Node 22+, Java 21 and the Android SDK for Android builds; use macOS and a
compatible Xcode for iOS compilation. CLI and asset tooling are lockfile dependencies.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run cap:add:android
npm run cap:add:ios -- --packagemanager SPM
npm run cap:assets
npm run cap:sync
```

Add each platform only once in a clean checkout. Generated native projects are
ignored. The iOS project uses Swift Package Manager, not a CocoaPods workspace.
The mobile validation workflow creates Android debug and unsigned iOS simulator
artifacts without signing or publishing.

## Release gates

The Codemagic workflows now build artifacts only. The iOS archive requires existing
owner-approved signing profiles. The Android release bundle is unsigned until an
upload-key signing configuration is implemented and verified. Neither workflow
publishes to TestFlight or Play. Do not submit an unsigned artifact.

Before an explicitly authorized release:

1. Confirm developer-account access, app identifiers and ownership, signing profiles,
   upload-key custody, build numbers and platform target requirements.
2. Validate the full application on physical iOS and Android devices, including poor
   connectivity, recovery, deep links, authentication and donation/payment behavior.
3. Complete backend push enrollment, consent, token lifecycle and APNs/FCM delivery
   before describing push as a product feature. The app currently does not request
   notification permission.
4. Review functionality and donation/payment eligibility against current store
   policies. A website shell and offline error screen do not guarantee acceptance.
5. Prepare branded screenshots/icons, support contacts, privacy disclosures, data
   safety declarations, account-deletion flows where applicable, review notes and
   any required demo account. Validate proposed privacy/support URLs on the live site.
6. After owner approval, build and test signed artifacts, then complete store testing
   and review. Account configuration, signing, submission and deployment were not
   performed as part of the code readiness work.

Do not commit signing keys, provisioning credentials, service-account JSON or secrets.
