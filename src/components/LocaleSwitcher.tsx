'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/routing';

export default function LocaleSwitcher({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function change(next: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const textColor = tone === 'light' ? 'text-ivory/90 hover:text-white' : 'text-navy hover:text-champagne-dark';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide transition-colors ${textColor}`}
      >
        <GlobeIcon />
        <span>{locale}</span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-xl border border-navy/10 bg-warmwhite py-1 shadow-xl"
        >
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => change(l)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-ivory ${
                  l === locale ? 'font-semibold text-navy' : 'text-softgray'
                }`}
              >
                <span>{localeNames[l]}</span>
                <span className="text-xs uppercase text-champagne-dark">{l}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
