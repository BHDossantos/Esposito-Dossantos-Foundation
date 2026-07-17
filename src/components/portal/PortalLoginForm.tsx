'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function PortalLoginForm() {
  const t = useTranslations('portal.login');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'notConfigured'>('idle');
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === 'link') {
      setLinkError(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const email = new FormData(e.currentTarget).get('email');
    try {
      const res = await fetch('/api/portal/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale })
      });
      const data = await res.json();
      if (data?.configured === false) {
        setStatus('notConfigured');
        return;
      }
      setStatus(data?.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-champagne/30 bg-warmwhite p-8 text-center">
        <p className="font-serif text-2xl text-navy">{t('sentTitle')}</p>
        <p className="mt-2 text-softgray">{t('sentBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy/10 bg-warmwhite p-8">
      {linkError ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {t('linkError')}
        </p>
      ) : null}
      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
        {t('emailLabel')}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
      />
      <button type="submit" disabled={status === 'loading'} className="btn-primary mt-5 w-full">
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>
      {status === 'error' ? (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {t('linkError')}
        </p>
      ) : null}
      {status === 'notConfigured' ? (
        <p className="mt-3 text-sm text-softgray" role="status">
          {t('notConfigured')}
        </p>
      ) : null}
    </form>
  );
}
