'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('error');

  return (
    <section className="flex min-h-[70vh] items-center bg-navy-900">
      <div className="container-px text-center">
        <p className="font-serif text-6xl font-semibold text-champagne">!</p>
        <h1 className="mt-6 text-3xl text-ivory sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-ivory/70">{t('body')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={reset} className="btn-primary">
            {t('retry')}
          </button>
          <Link href="/" className="btn-ghost-light">
            {t('home')}
          </Link>
        </div>
      </div>
    </section>
  );
}
