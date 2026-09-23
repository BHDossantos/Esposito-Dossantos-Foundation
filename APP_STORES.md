# Publishing the mobile apps (iOS + Android)

The Harmonia Foundation mobile apps are a **Capacitor** native shell around the
live website. The app opens the deployed site (`https://harmonia-foundation.org`)
inside a native container and adds native capabilities (push notifications,
offline fallback). Because the content is loaded from the live site,
**content/design updates ship instantly with no app-store resubmission** — you
only rebuild the app when native code changes.

- **App name:** Harmonia Foundation
- **Bundle / application ID:** `org.harmoniafoundation.app`
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

`assets/icon-only.png`, `icon-foreground.png`, `icon-background.png`, and
`splash*.png` are the committed brand source art. `npm run cap:assets`
turns them into every size iOS and Android require.

> **Why the Capacitor CLI isn't a committed dependency.** The `@capacitor/cli`
> and `@capacitor/assets` tools pull a transitive `xcode → uuid` chain with a
> dev-only security advisory and no fix path, and the website never imports
> them. So the `cap:*` npm scripts invoke them with `npx` (fetched only on the
> build machine); only the runtime packages the app actually uses
> (`@capacitor/core`, `/app`, `/push-notifications`) and the platform scaffolds
> (`@capacitor/ios`, `/android`) are installed. Nothing extra to do — the
> scripts handle it.

---

## 2. Android → Google Play

1. `npm run cap:open:android` opens Android Studio.
2. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**. Create
   an upload keystore when prompted and **store it safely** — you need the same
   key for every future update.
3. In the **Play Console**: create the app → upload the `.aab` to the
   **Internal testing** track first, then promote to Production.
4. Fill the **Data safety** form (see §5) and the store listing (§4).

Android accepts web-backed apps without issue.

## 3. iOS → App Store — **without owning a Mac**

iOS binaries can only be built on macOS, but you don't need to buy a Mac.
Pick one:

- **Codemagic (recommended, has a free tier).** Connect the repo, choose the
  Capacitor/iOS workflow, add your Apple Developer credentials (Codemagic
  automates signing), and it produces and uploads the build to TestFlight /
  App Store Connect. `codemagic.yaml` can be added on request.
- **Ionic Appflow** or **GitHub Actions `macos-latest` runners** — same idea,
  cloud macOS.
- **A borrowed/rented Mac** (e.g. MacinCloud) with Xcode: `npm run cap:open:ios`,
  set the team/signing, Product → Archive → distribute to App Store Connect.

Then in **App Store Connect**: create the app, submit the build via
**TestFlight**, complete the listing (§4) and **privacy nutrition labels** (§5),
and submit for review.

> **App Review guideline 4.2 (minimum functionality).** Apple can reject apps
> that are "just a website." This app mitigates that with **native push
> notifications** and an **offline experience**. In the review notes, describe
> it as the foundation's official app with donation, event RSVP, scholarship
> applications, and push updates. Enabling push (see §6) before submission is
> strongly recommended.

---

## 4. Store listing content

Reuse the vetted copy from the **Press page** (`/press`) and translations:

- **Name:** Harmonia Foundation
- **Subtitle / short description:** "Empowering lives through education, music,
  technology, and opportunity."
- **Description:** the extended boilerplate from `messages/*.json → press.boilerplate.long`.
- **Keywords:** nonprofit, foundation, scholarships, donate, music education, mentorship.
- **Category:** Education (primary) / Lifestyle (secondary).
- **Localizations:** list English, Portuguese, Italian, Spanish — the app is
  fully translated, which strengthens both listings.
- **Support URL:** `https://harmonia-foundation.org/contact`
- **Marketing URL:** `https://harmonia-foundation.org`
- **Privacy Policy URL:** `https://harmonia-foundation.org/privacy` (required by both stores)

**Screenshots** (capture from the live site in a device / simulator):
- iPhone 6.7" (1290×2796) and 6.5" (1242×2688) — required.
- iPad 12.9" (2048×2732) if you enable iPad.
- Android phone (min 1080px) + a 1024×500 feature graphic.

---

## 5. Privacy declarations

Declare what the site collects, based on current features:

- **Contact / newsletter / applications:** name, email, country (contact info).
- **Donations:** handled by **Stripe** — payment info is processed by Stripe, not
  stored by the app.
- **No tracking/ads** unless you later add analytics — if you add GA4, declare
  "Analytics" and usage data.

Fill **Google Play → Data safety** and **App Store Connect → App Privacy** to
match. Both link to `https://harmonia-foundation.org/privacy`.

---

## 6. Push notifications (native value + review-friendly)

`NativeBridge` already requests permission and registers on launch. To actually
deliver notifications you must set up the provider credentials:

- **iOS:** an **APNs key** (.p8) in App Store Connect → wire it into your push
  provider (Firebase Cloud Messaging or OneSignal).
- **Android:** a **Firebase (FCM)** project; add `google-services.json` to
  `android/app/`.

If you'd rather not run a provider, **OneSignal** has a free tier and a Capacitor
plugin; say the word and I'll swap `@capacitor/push-notifications` for it and add
the wiring.

---

## 7. Updating the apps later

- **Website content or design change** → just deploy the site. The apps show it
  immediately; no resubmission.
- **Native change** (new plugin, icon, permissions, Capacitor upgrade) → rebuild
  and resubmit the binary.

---

## What's already in the repo

- `capacitor.config.ts` — app id, name, backing URL, push config
- `native/www/index.html` — branded offline fallback
- `src/components/native/NativeBridge.tsx` — push registration + Android back button
- `assets/` — brand icon + splash source art (navy + champagne "H")
- `scripts/gen-app-icons.mjs` — regenerates the source art
- npm scripts: `cap:add:ios`, `cap:add:android`, `cap:assets`, `cap:sync`, `cap:open:*`

**Still done by you (accounts/signing/submission):** running `cap add` on your
build machine, signing, store listings, screenshots, privacy forms, and pressing
Submit. I can add a `codemagic.yaml` for hands-off iOS builds whenever you want.
