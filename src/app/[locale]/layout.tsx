import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import ScrollProgress from '@/components/interactive/ScrollProgress';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL('https://esposito-dossantos.org'),
    title: {
      default: t('defaultTitle'),
      template: `%s · ${t('siteName')}`
    },
    description: t('defaultDescription'),
    keywords: [
      'nonprofit foundation',
      'music education foundation',
      'youth scholarship foundation',
      'global education nonprofit',
      'arts and culture foundation',
      'technology education nonprofit',
      'corporate sponsorship nonprofit'
    ],
    authors: [{ name: 'Esposito–Dossantos Foundation' }],
    openGraph: {
      type: 'website',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      siteName: t('siteName'),
      locale
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription')
    },
    robots: { index: true, follow: true }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'organization' });

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Esposito–Dossantos Foundation',
    alternateName: t('alternateName'),
    description: t('description'),
    url: 'https://esposito-dossantos.org',
    sameAs: [] as string[],
    foundingDate: '2025',
    knowsLanguage: ['en', 'pt', 'it', 'es']
  };

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
            focus:rounded-full focus:bg-navy focus:px-5 focus:py-2 focus:text-sm focus:text-ivory"
        >
          Skip to content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ScrollProgress />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
