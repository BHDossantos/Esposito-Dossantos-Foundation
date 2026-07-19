import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className="flex min-h-[70vh] items-center bg-navy-900">
      <div className="container-px text-center">
        <p className="font-serif text-7xl font-semibold text-champagne">404</p>
        <h1 className="mt-6 text-3xl text-ivory sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-ivory/70">{t('body')}</p>
        <Link href="/" className="btn-primary mt-8">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
