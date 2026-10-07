'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Monthly sponsorship levels. Amounts are tied to the Foundation's real
// per-unit program costs; they are not copied from any other organization.
const TIERS = [
  { key: 'supporter', amount: 15 },
  { key: 'mentor', amount: 30 },
  { key: 'patron', amount: 60 },
  { key: 'guardian', amount: 100 }
] as const;

export default function SponsorTiers() {
  const t = useTranslations('sponsor');
  const locale = useLocale();
  const [pending, setPending] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'notConfigured' | 'error'>('idle');

  async function sponsor(amount: number, key: string) {
    setPending(key);
    setStatus('idle');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, frequency: 'monthly', currency: 'eur', locale })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setStatus(data?.configured === false ? 'notConfigured' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {TIERS.map(({ key, amount }) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl border border-navy/10 bg-warmwhite p-7 transition hover:border-champagne/40 hover:shadow-lg hover:shadow-navy/5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-xl text-navy">{t(`tiers.${key}.name`)}</h3>
              <p className="shrink-0">
                <span className="font-serif text-2xl font-semibold text-champagne-dark">
                  &euro;{amount}
                </span>
                <span className="text-sm text-softgray">{t('perMonth')}</span>
              </p>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-softgray">
              {t(`tiers.${key}.blurb`)}
            </p>
            <button
              type="button"
              onClick={() => sponsor(amount, key)}
              disabled={pending !== null}
              className="btn-primary mt-6 w-full"
            >
              {pending === key ? t('processing') : t('sponsorCta')}
            </button>
          </div>
        ))}
      </div>

      {status === 'notConfigured' ? (
        <p
          className="mt-6 rounded-lg bg-champagne/10 px-4 py-3 text-center text-sm text-navy/80"
          role="status"
        >
          {t('notConfigured')}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="mt-6 text-center text-sm font-medium text-red-700" role="alert">
          {t('error')}
        </p>
      ) : null}

      <p className="mt-6 text-center text-xs leading-relaxed text-softgray">{t('cancelNote')}</p>
    </div>
  );
}
