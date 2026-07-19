import type { Locale } from '@/i18n/routing';
import { chaptersMeta, type ChapterContent, type LocalizedChapter } from './meta';
import en from './en';
import pt from './pt';
import it from './it';
import es from './es';

const byLocale: Record<Locale, ChapterContent> = { en, pt, it, es };

export type ResolvedChapter = LocalizedChapter & {
  slug: string;
  flag: string;
  cover: string;
};

function resolve(locale: Locale, slug: string): ResolvedChapter | null {
  const meta = chaptersMeta.find((c) => c.slug === slug);
  if (!meta) return null;
  const content = byLocale[locale]?.[slug] ?? byLocale.en[slug];
  if (!content) return null;
  return { ...meta, ...content };
}

export function getAllChapters(locale: Locale): ResolvedChapter[] {
  return chaptersMeta
    .map((m) => resolve(locale, m.slug))
    .filter((c): c is ResolvedChapter => c !== null);
}

export function getChapter(locale: Locale, slug: string): ResolvedChapter | null {
  return resolve(locale, slug);
}

export function getAllChapterSlugs(): string[] {
  return chaptersMeta.map((c) => c.slug);
}
