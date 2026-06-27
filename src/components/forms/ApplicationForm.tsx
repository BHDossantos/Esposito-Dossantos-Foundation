'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const volunteerInterests = ['music', 'education', 'technology', 'events', 'mentorship', 'admin'] as const;
const volunteerAvailability = ['weekly', 'monthly', 'events', 'flexible'] as const;
const scholarshipPrograms = ['music', 'education', 'technology', 'leadership'] as const;

export default function ApplicationForm({ kind }: { kind: 'volunteer' | 'scholarship' }) {
  const a = useTranslations('applications');
  const f = useTranslations(kind === 'volunteer' ? 'volunteer.form' : 'scholarships.form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type: kind })
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-champagne/30 bg-warmwhite p-10 text-center">
        <p className="font-serif text-2xl text-navy">{a('successTitle')}</p>
        <p className="mt-3 text-softgray">{a('successBody')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30';

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="app-name" className="mb-1.5 block text-sm font-medium text-navy">
          {a('name')} *
        </label>
        <input id="app-name" name="name" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="app-email" className="mb-1.5 block text-sm font-medium text-navy">
          {a('email')} *
        </label>
        <input id="app-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="app-country" className="mb-1.5 block text-sm font-medium text-navy">
          {a('country')}
        </label>
        <input id="app-country" name="country" autoComplete="country-name" className={inputClass} />
      </div>

      {kind === 'volunteer' ? (
        <>
          <div>
            <label htmlFor="app-interest" className="mb-1.5 block text-sm font-medium text-navy">
              {f('interestLabel')} *
            </label>
            <select id="app-interest" name="interest" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                {a('choose')}
              </option>
              {volunteerInterests.map((k) => (
                <option key={k} value={k}>
                  {f(`interests.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="app-availability" className="mb-1.5 block text-sm font-medium text-navy">
              {f('availabilityLabel')}
            </label>
            <select id="app-availability" name="availability" defaultValue="" className={inputClass}>
              <option value="" disabled>
                {a('choose')}
              </option>
              {volunteerAvailability.map((k) => (
                <option key={k} value={k}>
                  {f(`availabilities.${k}`)}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="app-program" className="mb-1.5 block text-sm font-medium text-navy">
              {f('programLabel')} *
            </label>
            <select id="app-program" name="program" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                {a('choose')}
              </option>
              {scholarshipPrograms.map((k) => (
                <option key={k} value={k}>
                  {f(`programs.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="app-institution" className="mb-1.5 block text-sm font-medium text-navy">
              {f('institutionLabel')}
            </label>
            <input id="app-institution" name="institution" className={inputClass} />
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label htmlFor="app-message" className="mb-1.5 block text-sm font-medium text-navy">
          {f('messageLabel')} *
        </label>
        <textarea id="app-message" name="message" rows={5} required className={inputClass} />
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="app-company">Company</label>
        <input id="app-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'loading'} className="btn-primary">
          {status === 'loading' ? a('submitting') : a('submit')}
        </button>
        {status === 'error' ? (
          <p className="mt-3 text-sm font-medium text-red-700" role="alert">
            {a('error')}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-softgray">{a('consent')}</p>
      </div>
    </form>
  );
}
