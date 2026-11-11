import type { CapacitorConfig } from '@capacitor/cli';

// The mobile apps are a native shell around the deployed website. The shell
// loads the live production site; `CAP_SERVER_URL` can override it (e.g. a
// Vercel preview URL) when building a test build.
const PRODUCTION_URL = 'https://espositodossantosfoundation.org';

const serverUrl = new URL(process.env.CAP_SERVER_URL || PRODUCTION_URL);
if (serverUrl.protocol !== 'https:' || serverUrl.username || serverUrl.password) {
  throw new Error('CAP_SERVER_URL must be an HTTPS URL without credentials');
}

const config: CapacitorConfig = {
  appId: 'org.espositodossantosfoundation.app',
  appName: 'Esposito–Dossantos Foundation',
  // Explicit errorPath routes failed remote navigation to the bundled fallback.
  webDir: 'native/www',
  server: {
    url: serverUrl.href,
    errorPath: 'index.html',
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
