# Mobile validation and release gates

Audit date: 2026-10-21. This repository has a Capacitor 8 shell around a remote
Next.js website. It is not an Expo app, so Jennifer's Expo export commands do
not validate this native shell.

## Automated checks

`.github/workflows/mobile-validation.yml` runs on pull requests, the active
production-source/default branch, `main`, and manual dispatch. It:

1. Runs shell contract tests for app identity, preview configuration, matching
   locked Capacitor platform versions, and bundled offline/icon resources.
2. Generates Android from scratch, syncs plugins, builds a debug APK, and runs
   Android lint and the generated native unit-test task using Node 22 / Java 21.
3. Generates iOS with Swift Package Manager and compiles an **unsigned simulator**
   app on macOS 26. It uploads a ZIP containing the `.app`.

Artifacts are retained for seven days. They are test artifacts, not store-ready
releases. The Android debug APK uses the standard disposable debug key; no
production credentials or distribution keys are used. The workflow cannot
publish to either store and does not call Codemagic. Existing web CI still runs
lint, typecheck, unit tests, and a Next.js build separately.

Run shell tests locally with `npm ci && npm run test:mobile`. For Android:

```sh
npm run cap:add:android
npm run cap:assets -- --android
npm run cap:sync -- android
(cd android && ./gradlew --no-daemon assembleDebug lintDebug testDebugUnitTest)
```

Native directories are deliberately generated and ignored. Start from a fresh
checkout when validating generation. Capacitor CLI is version-pinned in npm
scripts, without adding it to the website's dependency tree. When updating the
runtime/platform lockfile versions, update the CLI pin at the same time.

## What these checks do not prove

A successful compile is not a device end-to-end test. The shell contract tests
inspect resources and configuration; they do not prove offline navigation,
notification delivery, login, payments, or store approval. The generated native
unit tests are template sanity checks, not product-flow coverage. Before a
release, test a real Android device and an iPhone/simulator against a staging
website and capture results for:

- cold launch, connection loss, reconnection, and retry;
- every supported language, safe areas, keyboard, rotation, and Android Back;
- sign-in/magic-link return paths and donation/checkout return paths;
- denied/granted notification permissions and actual push delivery;
- accessibility, external links, privacy notices, and deletion requests.

## Release blockers requiring deliberate follow-up

- **Remote-site architecture:** `server.url` currently loads the production
  site. Capacitor documents this option as intended for live reload, not
  production. Evaluate bundled UI plus a remote API before claiming a supported
  production architecture; do not silently switch this server-rendered app to
  static export. See [Capacitor config](https://capacitorjs.com/docs/config).
- **Offline experience:** the local page exists, but `server.errorPath` is not
  configured. Do not assume `webDir` alone guarantees fallback when the remote
  site is unreachable. This requires native error/retry implementation and
  device verification, not merely a passing resource test.
- **Push:** `NativeBridge` requests permission/registers but has no token
  persistence/provider delivery integration. APNs/FCM configuration and
  end-to-end delivery are still required. Also verify listener cleanup and
  back-button behavior across remounts.
- **Existing Codemagic release recipes:** still use Node 20 / Java 17, tolerate
  generation errors with `|| true`, and assume a CocoaPods workspace although
  Capacitor 8 generates SPM by default. These release recipes are not executed
  by this validation change; repair and explicitly approve them before use.
- **Release ownership:** signing, store accounts/app records, version/build
  numbers, screenshots, privacy/data safety declarations, and distribution
  approval remain separate gates. Do not infer account readiness from older
  documentation. A web wrapper or push dependency does not guarantee review
  acceptance or monetization readiness.

Toolchain references: [Capacitor 8 migration](https://capacitorjs.com/docs/updating/8-0),
[environment setup](https://capacitorjs.com/docs/getting-started/environment-setup),
[macOS 26 runner image](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-Readme.md).
