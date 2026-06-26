import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function FinalCTA() {
  const t = useTranslations('home.finalCta');

  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-champagne/15 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-navy-600/40 blur-[120px]" />
      </div>
      <div className="container-px relative z-10 text-center">
        <p className="eyebrow text-champagne-light">{t('eyebrow')}</p>
        <h2 className="mx-auto mt-6 max-w-3xl text-3xl text-ivory sm:text-4xl lg:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory/75">{t('subtitle')}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/donate" className="btn-primary">
            {t('donate')}
          </Link>
          <Link href="/partners" className="btn-ghost-light">
            {t('partner')}
          </Link>
          <Link href="/contact" className="btn-ghost-light">
            {t('contact')}
          </Link>
        </div>
      </div>
    </section>
  );
}
