// Locale-agnostic event metadata. Localized fields (title, summary,
// description, dateLabel, location) live in the per-locale files.
export type EventMeta = {
  slug: string;
  /** ISO date for sorting + Event schema; empty string when "to be announced". */
  isoDate: string;
  /** Tailwind gradient for the cover placeholder. */
  cover: string;
  /** Drives the status pill styling. */
  status: 'open' | 'soon' | 'recurring';
};

export const eventsMeta: EventMeta[] = [
  {
    slug: 'annual-fundraising-gala',
    isoDate: '2026-11-14',
    cover: 'from-navy-700 via-navy-800 to-navy-900',
    status: 'soon'
  },
  {
    slug: 'charity-concert-series',
    isoDate: '2026-09-20',
    cover: 'from-[#1b2e4a] via-navy-800 to-[#0a1830]',
    status: 'recurring'
  },
  {
    slug: 'scholarship-night',
    isoDate: '2026-10-03',
    cover: 'from-[#243a5e] via-navy-700 to-navy-900',
    status: 'soon'
  },
  {
    slug: 'music-masterclasses',
    isoDate: '2026-07-12',
    cover: 'from-[#2a2140] via-navy-800 to-navy-900',
    status: 'open'
  },
  {
    slug: 'community-workshops',
    isoDate: '',
    cover: 'from-[#1e3a3a] via-navy-800 to-navy-900',
    status: 'recurring'
  },
  {
    slug: 'cultural-festival',
    isoDate: '',
    cover: 'from-[#3a2a1e] via-navy-800 to-navy-900',
    status: 'recurring'
  }
];

export type LocalizedEvent = {
  dateLabel: string;
  location: string;
  title: string;
  summary: string;
  description: string[];
};

export type EventContent = Record<string, LocalizedEvent>;
