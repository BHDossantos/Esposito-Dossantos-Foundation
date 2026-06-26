'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const interests = ['donor', 'volunteer', 'artist', 'student', 'school', 'sponsor', 'media'] as const;

export default function NewsletterForm() {
  const t = useTranslations('newsletter');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    // Placeholder submission. Wire to /api/newsletter -> CRM (HubSpot/Supabase).
    setTimeout(() => setStatus('success'), 700);
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-champagne/30 bg-warmwhite p-8 text-center">
        <p className="font-serif text-2xl text-navy">{t('successTitle')}</p>
        <p className="mt-2 text-softgray">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="nl-name" className="mb-1.5 block text-sm font-medium text-navy">
          {t('name')}
        </label>
        <input
          id="nl-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
        />
      </div>
      <div>
        <label htmlFor="nl-email" className="mb-1.5 block text-sm font-medium text-navy">
          {t('email')}
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
        />
      </div>
      <div>
        <label htmlFor="nl-country" className="mb-1.5 block text-sm font-medium text-navy">
          {t('country')}
        </label>
        <input
          id="nl-country"
          name="country"
          type="text"
          autoComplete="country-name"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
        />
      </div>
      <div>
        <label htmlFor="nl-interest" className="mb-1.5 block text-sm font-medium text-navy">
          {t('interest')}
        </label>
        <select
          id="nl-interest"
          name="interest"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
        >
          {interests.map((opt) => (
            <option key={opt} value={opt}>
              {t(`interests.${opt}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>
        <p className="mt-3 text-xs text-softgray">{t('consent')}</p>
      </div>
    </form>
  );
}
