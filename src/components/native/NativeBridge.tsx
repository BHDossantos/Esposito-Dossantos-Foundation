'use client';

import { useEffect } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';

// Native back navigation only. Push enrollment is intentionally unavailable until
// authenticated token storage, revocation and APNs/FCM delivery are implemented.
export default function NativeBridge() {
  useEffect(() => {
    let disposed = false;
    let backListener: PluginListenerHandle | undefined;

    async function connect() {
      const { Capacitor } = await import('@capacitor/core');
      if (disposed || !Capacitor.isNativePlatform()) return;
      const { App } = await import('@capacitor/app');
      if (disposed) return;
      const listener = await App.addListener('backButton', ({ canGoBack }) => {
        if (disposed) return;
        if (canGoBack) window.history.back();
        else void App.exitApp();
      });
      if (disposed) await listener.remove();
      else backListener = listener;
    }
    void connect().catch(() => { /* Optional native bridge; web content remains usable. */ });
    return () => {
      disposed = true;
      if (backListener) void backListener.remove().catch(() => {});
    };
  }, []);
  return null;
}
