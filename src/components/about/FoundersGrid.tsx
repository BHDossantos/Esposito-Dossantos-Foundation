'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';

export type Founder = {
  key: string;
  initial: string;
  name: string;
  role: string;
  bio: string;
  full: string[];
};

/**
 * The three founder cards. Each shows a short teaser and a "Read more"
 * button that opens an accessible modal with the full biography.
 */
export default function FoundersGrid({
  founders,
  readMoreLabel,
  closeLabel
}: {
  founders: Founder[];
  readMoreLabel: string;
  closeLabel: string;
}) {
  const [active, setActive] = useState<Founder | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    lastFocused.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus();
    };
  }, [active]);

  return (
    <>
      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
        {founders.map((f, i) => (
          <Reveal as="div" key={f.key} delay={i * 90}>
            <div className="flex h-full flex-col rounded-2xl border border-navy/10 bg-warmwhite p-8 text-center transition hover:border-champagne/40 hover:shadow-lg hover:shadow-navy/5">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-champagne font-serif text-2xl font-semibold text-champagne-dark">
                {f.initial}
              </span>
              <h3 className="mt-5 font-serif text-xl text-navy">{f.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                {f.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-softgray">{f.bio}</p>
              <button
                type="button"
                onClick={() => setActive(f)}
                className="group mt-5 inline-flex items-center justify-center gap-1 self-center text-sm font-semibold text-navy transition hover:text-champagne-dark"
                aria-haspopup="dialog"
              >
                {readMoreLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="founder-modal-title"
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
          />
          {/* Panel */}
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-warmwhite p-8 shadow-2xl sm:rounded-3xl sm:p-10">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-champagne font-serif text-xl font-semibold text-champagne-dark">
                {active.initial}
              </span>
              <div className="min-w-0">
                <h2 id="founder-modal-title" className="font-serif text-2xl text-navy">
                  {active.name}
                </h2>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                  {active.role}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActive(null)}
                aria-label={closeLabel}
                className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:bg-navy/5"
              >
                <span aria-hidden className="text-lg leading-none">
                  &times;
                </span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {active.full.map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-ink/80">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
