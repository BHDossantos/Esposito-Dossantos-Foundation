import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HeartIcon } from '@/components/Icons';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'donateThankYou');
}

export default async function ThankYouPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ThankYouContent />;
}

function ThankYouContent() {
  const t = useTranslations('donateThankYou');

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-900">
      <div className="absolute inset-0">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-champagne/15 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-navy-600/40 blur-[120px]" />
      </div>
      <div className="container-px relative z-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-champagne/15 text-champagne">
          <HeartIcon width={30} height={30} />
        </span>
        <p className="eyebrow mt-8 text-champagne-light">{t('eyebrow')}</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold text-ivory sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">{t('body')}</p>
        <Link href="/" className="btn-primary mt-10">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
