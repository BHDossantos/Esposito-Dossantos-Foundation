import type { Locale } from '@/i18n/routing';
import { eventsMeta, type EventContent, type LocalizedEvent } from './meta';
import en from './en';
import pt from './pt';
import it from './it';
import es from './es';

const byLocale: Record<Locale, EventContent> = { en, pt, it, es };

export type ResolvedEvent = LocalizedEvent & {
  slug: string;
  isoDate: string;
  cover: string;
  status: 'open' | 'soon' | 'recurring';
};

function resolve(locale: Locale, slug: string): ResolvedEvent | null {
  const meta = eventsMeta.find((e) => e.slug === slug);
  if (!meta) return null;
  const content = byLocale[locale]?.[slug] ?? byLocale.en[slug];
  if (!content) return null;
  return { ...meta, ...content };
}

export function getAllEvents(locale: Locale): ResolvedEvent[] {
  return eventsMeta
    .map((m) => resolve(locale, m.slug))
    .filter((e): e is ResolvedEvent => e !== null);
}

export function getEvent(locale: Locale, slug: string): ResolvedEvent | null {
  return resolve(locale, slug);
}

export function getAllEventSlugs(): string[] {
  return eventsMeta.map((e) => e.slug);
}
