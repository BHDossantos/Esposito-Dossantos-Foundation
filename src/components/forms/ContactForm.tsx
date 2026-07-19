'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const inquiryTypes = ['general', 'donation', 'partnership', 'volunteer', 'media', 'grant'] as const;

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
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
      <div role="status" className="rounded-2xl border border-champagne/30 bg-warmwhite p-10 text-center">
        <p className="font-serif text-2xl text-navy">{t('successTitle')}</p>
        <p className="mt-3 text-softgray">{t('successBody')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30';

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-navy">
          {t('name')} *
        </label>
        <input id="c-name" name="name" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-navy">
          {t('email')} *
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="c-country" className="mb-1.5 block text-sm font-medium text-navy">
          {t('country')}
        </label>
        <input id="c-country" name="country" autoComplete="country-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="c-type" className="mb-1.5 block text-sm font-medium text-navy">
          {t('inquiryType')} *
        </label>
        <select id="c-type" name="inquiryType" required className={inputClass}>
          {inquiryTypes.map((opt) => (
            <option key={opt} value={opt}>
              {t(`types.${opt}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-navy">
          {t('message')} *
        </label>
        <textarea id="c-message" name="message" rows={5} required className={inputClass} />
      </div>
      {/* Honeypot — hidden from users, catches bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
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
        <p className="mt-3 text-xs text-softgray">{t('privacyNote')}</p>
      </div>
    </form>
  );
}
