# Publishing the mobile apps (iOS + Android)

> Read [mobile validation and release gates](docs/MOBILE_READINESS.md) first.
> The unsigned validation workflow does not publish. The older release recipes
> below are not proof that offline behavior, push delivery, signing, or store
> readiness has been verified.

The Esposito–Dossantos Foundation mobile apps are a **Capacitor** native shell around the
live website. The app opens the deployed site (`https://espositodossantosfoundation.org`)
inside a native container and adds native capabilities (push notifications,
offline fallback). Because the content is loaded from the live site,
**content/design updates ship instantly with no app-store resubmission** — you
only rebuild the app when native code changes.

- **App name:** Esposito–Dossantos Foundation
- **Bundle / application ID:** `org.espositodossantosfoundation.app`
- **Backing URL:** set in `capacitor.config.ts` (override per build with the
  `CAP_SERVER_URL` env var, e.g. a Vercel preview URL for testing)

---

## 0. Prerequisites

| Need | Status | Notes |
| --- | --- | --- |
| Google Play Console account | ✅ you have it | $25 one-time |
| Apple Developer Program | ✅ you have it | $99/year |
| Node 20+ | for the build machine | already used for the website |
| **macOS + Xcode** *or* a cloud-Mac service | ⚠️ needed for iOS | you don't need to own a Mac — see §3 |
| Android Studio (or CI) | for Android | free |

> **Deploy the website first.** The app loads the live URL, so the site must be
> live on Vercel before the apps are useful. (See `DEPLOYMENT.md`.)

---

## 1. One-time local setup

From the repo root, on any machine (Mac, Windows, or Linux for Android):

```bash
npm install
npm run gen:app-icons        # regenerates assets/ source art (already committed)
npm run cap:add:android      # creates the android/ project
npm run cap:add:ios          # creates the ios/ project (macOS only)
npm run cap:assets           # generates all icon + splash sizes into the projects
npm run cap:sync             # copies config + web fallback into the native projects
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
