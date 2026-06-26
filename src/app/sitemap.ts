import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://esposito-dossantos.org';

const paths = [
  '',
  '/mission',
  '/programs',
  '/impact',
  '/events',
  '/donate',
  '/partners',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${path}`,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${baseUrl}${l === routing.defaultLocale ? '' : `/${l}`}${path}`
            ])
          )
        }
      });
    }
  }

  return entries;
}
