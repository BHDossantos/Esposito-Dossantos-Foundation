'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const amounts = [25, 50, 100, 250, 1000];
const frequencies = ['oneTime', 'monthly', 'annual'] as const;

export default function DonateForm() {
  const t = useTranslations('donate.form');
  const locale = useLocale();
  const [frequency, setFrequency] = useState<(typeof frequencies)[number]>('monthly');
  const [amount, setAmount] = useState<number>(100);
  const [custom, setCustom] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'notConfigured' | 'error'>('idle');

  const effectiveAmount = custom ? Number(custom) : amount;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 1) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, frequency, currency: 'eur', locale })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
        return;
      }
      setStatus(data?.configured === false ? 'notConfigured' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy/10 bg-warmwhite p-6 shadow-sm sm:p-8">
      {/* Frequency */}
      <fieldset>
        <legend className="text-sm font-semibold text-navy">{t('frequency')}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-full bg-ivory p-1">
          {frequencies.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`rounded-full py-2 text-sm font-medium transition ${
                frequency === f ? 'bg-navy text-ivory shadow' : 'text-navy hover:text-champagne-dark'
              }`}
            >
              {t(`frequencies.${f}`)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Amount */}
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-navy">{t('chooseAmount')}</legend>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {amounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setCustom('');
              }}
              className={`rounded-xl border py-4 text-center transition ${
                amount === a && !custom
                  ? 'border-champagne bg-champagne/10 text-navy'
                  : 'border-navy/15 text-navy hover:border-champagne/50'
              }`}
            >
              <span className="block font-serif text-xl font-semibold">€{a}</span>
              <span className="mt-1 block text-[0.7rem] leading-tight text-softgray">
                {t(`tiers.${a}`)}
              </span>
            </button>
          ))}
          <div className="rounded-xl border border-navy/15 px-3 py-2 focus-within:border-champagne">
            <label htmlFor="custom" className="block text-[0.7rem] text-softgray">
              {t('custom')}
            </label>
            <div className="flex items-center">
              <span className="font-serif text-lg text-navy">€</span>
              <input
                id="custom"
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="—"
                className="w-full bg-transparent px-1 font-serif text-lg text-navy outline-none"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={status === 'loading'} className="btn-primary mt-7 w-full">
        {status === 'loading'
          ? t('processing')
          : t('give', { amount: effectiveAmount || 0, frequency: t(`frequencies.${frequency}`) })}
      </button>

      {status === 'notConfigured' ? (
        <p className="mt-3 rounded-lg bg-champagne/10 px-4 py-3 text-center text-sm text-navy/80" role="status">
          {t('notConfigured')}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">
          {t('error')}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-softgray">
        <span>{t('methods')}</span>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-softgray">{t('secure')}</p>
    </form>
  );
}
