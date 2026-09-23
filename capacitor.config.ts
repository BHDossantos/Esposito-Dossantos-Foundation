import type { CapacitorConfig } from '@capacitor/cli';

// The mobile apps are a native shell around the deployed website. The shell
// loads the live production site; `CAP_SERVER_URL` can override it (e.g. a
// Vercel preview URL) when building a test build.
const PRODUCTION_URL = 'https://harmonia-foundation.org';

const config: CapacitorConfig = {
  appId: 'org.harmoniafoundation.app',
  appName: 'Harmonia Foundation',
  // Offline fallback bundle. When `server.url` is reachable the live site is
  // shown; this local copy is what loads if the device is offline.
  webDir: 'native/www',
  server: {
    url: process.env.CAP_SERVER_URL || PRODUCTION_URL,
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
