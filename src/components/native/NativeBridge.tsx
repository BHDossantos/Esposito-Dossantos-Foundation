'use client';

import { useEffect } from 'react';

// Runs only inside the native Capacitor shell (iOS/Android). On the web this
// is a no-op: the dynamic imports resolve but `isNativePlatform()` is false, so
// nothing loads or registers. Kept out of SSR by living in a client effect.
export default function NativeBridge() {
  useEffect(() => {
    let disposed = false;

    (async () => {
      const { Capacitor } = await import('@capacitor/core');
      if (disposed || !Capacitor.isNativePlatform()) return;

      // Push notifications — the native capability that gives the app value
      // beyond the website (and helps satisfy App Store review guideline 4.2).
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');
        const perm = await PushNotifications.checkPermissions();
        let receive = perm.receive;
        if (receive === 'prompt' || receive === 'prompt-with-rationale') {
          receive = (await PushNotifications.requestPermissions()).receive;
        }
        if (receive === 'granted') {
          await PushNotifications.register();
        }
      } catch {
        // Plugin unavailable or permission denied — the app still works.
      }

      // Keep the status bar legible against the navy brand background.
      try {
        const { App } = await import('@capacitor/app');
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) window.history.back();
          else App.exitApp();
        });
      } catch {
        // @capacitor/app optional.
      }
    })();

    return () => {
      disposed = true;
    };
  }, []);

  return null;
}
