'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const inputClass =
  'w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30';

export default function StudentApplicationForm() {
  const t = useTranslations('apply.form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-champagne/30 bg-warmwhite p-10 text-center"
      >
        <p className="font-serif text-2xl text-navy">{t('successTitle')}</p>
        <p className="mt-3 text-softgray">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5 rounded-2xl border border-navy/10 bg-warmwhite p-6 shadow-sm sm:grid-cols-2 sm:p-8"
    >
      <div>
        <label htmlFor="ap-first" className="mb-1.5 block text-sm font-medium text-navy">
          {t('firstName')} *
        </label>
        <input id="ap-first" name="firstName" required autoComplete="given-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ap-last" className="mb-1.5 block text-sm font-medium text-navy">
          {t('lastName')} *
        </label>
        <input id="ap-last" name="lastName" required autoComplete="family-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ap-email" className="mb-1.5 block text-sm font-medium text-navy">
          {t('email')} *
        </label>
        <input id="ap-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ap-age" className="mb-1.5 block text-sm font-medium text-navy">
          {t('age')}
        </label>
        <input id="ap-age" name="age" type="number" min={1} max={120} inputMode="numeric" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ap-address" className="mb-1.5 block text-sm font-medium text-navy">
          {t('address')}
        </label>
        <input id="ap-address" name="address" autoComplete="address-level2" className={inputClass} />
      </div>
      <div>
        <label htmlFor="ap-referral" className="mb-1.5 block text-sm font-medium text-navy">
          {t('referral')}
        </label>
        <input id="ap-referral" name="referral" className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="ap-need" className="mb-1.5 block text-sm font-medium text-navy">
          {t('need')} *
        </label>
        <textarea id="ap-need" name="need" rows={3} required className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ap-situation" className="mb-1.5 block text-sm font-medium text-navy">
          {t('situation')} *
        </label>
        <textarea
          id="ap-situation"
          name="situation"
          rows={5}
          required
          placeholder={t('situationPlaceholder')}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ap-motivation" className="mb-1.5 block text-sm font-medium text-navy">
          {t('motivation')}
        </label>
        <textarea id="ap-motivation" name="motivation" rows={3} className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ap-help" className="mb-1.5 block text-sm font-medium text-navy">
          {t('help')}
        </label>
        <textarea id="ap-help" name="help" rows={3} className={inputClass} />
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="ap-company">Company</label>
        <input id="ap-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'loading'} className="btn-primary">
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>
        {status === 'error' ? (
          <p className="mt-3 text-sm font-medium text-red-700" role="alert">
            {t('error')}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-softgray">{t('consent')}</p>
      </div>
    </form>
  );
}
