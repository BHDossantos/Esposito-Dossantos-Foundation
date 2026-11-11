'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const inputClass =
  'w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30';

const VIDEO_SLOTS = [0, 1, 2, 3, 4]; // first three required

export default function AuditionForm() {
  const t = useTranslations('audition.form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [videos, setVideos] = useState<string[]>(['', '', '', '', '']);
  const [videoError, setVideoError] = useState(false);

  function setVideo(i: number, value: string) {
    setVideos((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const links = videos.map((v) => v.trim()).filter(Boolean);
    if (links.length < 3) {
      setVideoError(true);
      return;
    }
    setVideoError(false);
    setStatus('loading');

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/audition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          instrument: payload.instrument,
          title: payload.title,
          summary: payload.summary,
          videos: links,
          company: payload.company
        })
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
        <label htmlFor="au-first" className="mb-1.5 block text-sm font-medium text-navy">
          {t('firstName')} *
        </label>
        <input id="au-first" name="firstName" required autoComplete="given-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="au-last" className="mb-1.5 block text-sm font-medium text-navy">
          {t('lastName')} *
        </label>
        <input id="au-last" name="lastName" required autoComplete="family-name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="au-email" className="mb-1.5 block text-sm font-medium text-navy">
          {t('email')} *
        </label>
        <input id="au-email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="au-instrument" className="mb-1.5 block text-sm font-medium text-navy">
          {t('instrument')} *
        </label>
        <input
          id="au-instrument"
          name="instrument"
          required
          placeholder={t('instrumentPlaceholder')}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="au-title" className="mb-1.5 block text-sm font-medium text-navy">
          {t('titleLabel')}
        </label>
        <input id="au-title" name="title" placeholder={t('titlePlaceholder')} className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="au-summary" className="mb-1.5 block text-sm font-medium text-navy">
          {t('summaryLabel')} *
        </label>
        <textarea
          id="au-summary"
          name="summary"
          rows={6}
          required
          placeholder={t('summaryPlaceholder')}
          className={inputClass}
        />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="mb-1.5 block text-sm font-medium text-navy">{t('videosLabel')} *</legend>
        <p className="mb-3 text-xs leading-relaxed text-softgray">{t('videosHelp')}</p>
        <div className="grid gap-3">
          {VIDEO_SLOTS.map((i) => (
            <div key={i}>
              <label htmlFor={`au-video-${i}`} className="sr-only">
                {`${i + 1}`}
              </label>
              <div className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center text-sm font-semibold text-champagne-dark">
                  {i + 1}
                </span>
                <input
                  id={`au-video-${i}`}
                  type="url"
                  inputMode="url"
                  value={videos[i]}
                  onChange={(e) => setVideo(i, e.target.value)}
                  placeholder={t('videoPlaceholder')}
                  required={i < 3}
                  className={inputClass}
                />
                {i >= 3 ? (
                  <span className="w-16 shrink-0 text-xs text-softgray">{t('optional')}</span>
                ) : (
                  <span className="w-16 shrink-0" aria-hidden />
                )}
              </div>
            </div>
          ))}
        </div>
        {videoError ? (
          <p className="mt-2 text-sm font-medium text-red-700" role="alert">
            {t('videoRequired')}
          </p>
        ) : null}
      </fieldset>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="au-company">Company</label>
        <input id="au-company" name="company" tabIndex={-1} autoComplete="off" />
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
