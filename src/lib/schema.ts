import { routing } from '@/i18n/routing';

export const baseUrl = 'https://harmonia-foundation.org';

// Build a locale-aware absolute URL. The default locale is served without a
// prefix (localePrefix: 'as-needed'); other locales are prefixed.
export function localizedUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${baseUrl}${prefix}${path}`;
}

export type Crumb = { name: string; path: string };

// Produce a schema.org BreadcrumbList for a page's ancestry trail.
export function breadcrumbSchema(locale: string, trail: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale, crumb.path)
    }))
  };
}
