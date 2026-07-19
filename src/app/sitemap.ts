import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllSlugs as getPostSlugs } from '@/content/posts';
import { getAllEventSlugs } from '@/content/events';
import { getAllChapterSlugs } from '@/content/chapters';
import { localizedUrl } from '@/lib/schema';

// Public, indexable routes. Private areas (admin, donor/sponsor portals) and the
// donation thank-you page are intentionally excluded.
const staticPaths = [
  '',
  '/mission',
  '/programs',
  '/impact',
  '/transparency',
  '/events',
  '/blog',
  '/chapters',
  '/donate',
  '/partners',
  '/about',
  '/contact',
  '/volunteer',
  '/scholarships',
  '/annual-report',
  '/faq',
  '/press',
  '/privacy',
  '/terms',
  '/cookies'
];

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']) {
  return routing.locales.map((locale) => ({
    url: localizedUrl(locale, path),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)]))
    }
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push(...entry(path, path === '' ? 1 : 0.7, path === '' ? 'weekly' : 'monthly'));
  }
  for (const slug of getPostSlugs()) {
    entries.push(...entry(`/blog/${slug}`, 0.6, 'monthly'));
  }
  for (const slug of getAllEventSlugs()) {
    entries.push(...entry(`/events/${slug}`, 0.6, 'weekly'));
  }
  for (const slug of getAllChapterSlugs()) {
    entries.push(...entry(`/chapters/${slug}`, 0.6, 'monthly'));
  }

  return entries;
}
