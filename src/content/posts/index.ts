import type { Locale } from '@/i18n/routing';
import { postsMeta, type LocalizedPost, type PostContent } from './meta';
import en from './en';
import pt from './pt';
import it from './it';
import es from './es';

const byLocale: Record<Locale, PostContent> = { en, pt, it, es };

export type ResolvedPost = LocalizedPost & {
  slug: string;
  date: string;
  readingMinutes: number;
  cover: string;
  author: string;
};

function resolve(locale: Locale, slug: string): ResolvedPost | null {
  const meta = postsMeta.find((p) => p.slug === slug);
  if (!meta) return null;
  // Fall back to English for any locale that hasn't been translated yet.
  const content = byLocale[locale]?.[slug] ?? byLocale.en[slug];
  if (!content) return null;
  return { ...meta, ...content };
}

export function getAllPosts(locale: Locale): ResolvedPost[] {
  return postsMeta
    .map((m) => resolve(locale, m.slug))
    .filter((p): p is ResolvedPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(locale: Locale, slug: string): ResolvedPost | null {
  return resolve(locale, slug);
}

export function getAllSlugs(): string[] {
  return postsMeta.map((p) => p.slug);
}
