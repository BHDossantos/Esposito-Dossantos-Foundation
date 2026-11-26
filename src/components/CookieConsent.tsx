'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STORAGE_KEY = 'edf-cookie-consent';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function getNeedsConsent() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [dismissed, setDismissed] = useState(false);
  const needsConsent = useSyncExternalStore(subscribe, getNeedsConsent, () => false);
  const visible = needsConsent && !dismissed;

  function decide(value: 'accepted' | 'rejected') {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="container-px">
        <div className="flex flex-col gap-4 rounded-2xl border border-navy/10 bg-warmwhite p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-navy/80">
            {t('message')}{' '}
            <Link href="/cookies" className="font-semibold text-champagne-dark underline">
              {t('learnMore')}
            </Link>
          </p>
          <div className="flex flex-none gap-3">
            <button type="button" onClick={() => decide('rejected')} className="btn-secondary">
              {t('reject')}
            </button>
            <button type="button" onClick={() => decide('accepted')} className="btn-primary">
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
