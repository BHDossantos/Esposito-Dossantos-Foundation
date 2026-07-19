'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RsvpForm({
  eventSlug,
  eventTitle
}: {
  eventSlug: string;
  eventTitle: string;
}) {
  const t = useTranslations('rsvp');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, eventSlug, eventTitle })
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-champagne/30 bg-warmwhite p-8 text-center">
        <p className="font-serif text-2xl text-navy">{t('success')}</p>
        <p className="mt-2 text-softgray">{t('successBody')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30';

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy/10 bg-warmwhite p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="rsvp-name" className="mb-1.5 block text-sm font-medium text-navy">
            {t('name')} *
          </label>
          <input id="rsvp-name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="rsvp-email" className="mb-1.5 block text-sm font-medium text-navy">
            {t('email')} *
          </label>
          <input id="rsvp-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="rsvp-guests" className="mb-1.5 block text-sm font-medium text-navy">
            {t('guests')}
          </label>
          <input
            id="rsvp-guests"
            name="guests"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
            className={inputClass}
          />
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="rsvp-company">Company</label>
        <input id="rsvp-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary mt-6 w-full">
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>
      {status === 'error' ? (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {t('error')}
        </p>
      ) : null}
      <p className="mt-3 text-center text-xs text-softgray">{t('consent')}</p>
    </form>
  );
}
