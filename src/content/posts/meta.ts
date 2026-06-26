// Locale-agnostic post metadata. Localized fields (title, excerpt, body,
// category label) live in the per-locale files (en.ts, pt.ts, it.ts, es.ts).
export type PostMeta = {
  slug: string;
  /** ISO date — formatted per locale at render time. */
  date: string;
  readingMinutes: number;
  /** Tailwind gradient classes for the cover placeholder. */
  cover: string;
  author: string;
};

export const postsMeta: PostMeta[] = [
  {
    slug: 'announcing-the-foundation',
    date: '2026-06-01',
    readingMinutes: 4,
    cover: 'from-navy-700 via-navy-800 to-navy-900',
    author: 'Bruno Dossantos'
  },
  {
    slug: 'why-music-education-changes-lives',
    date: '2026-05-18',
    readingMinutes: 5,
    cover: 'from-[#1b2e4a] via-navy-800 to-[#0a1830]',
    author: 'Esposito–Dossantos Foundation'
  },
  {
    slug: 'talent-is-everywhere',
    date: '2026-05-02',
    readingMinutes: 4,
    cover: 'from-[#243a5e] via-navy-700 to-navy-900',
    author: 'Esposito–Dossantos Foundation'
  }
];

export type LocalizedPost = {
  category: string;
  title: string;
  excerpt: string;
  body: string[];
};

export type PostContent = Record<string, LocalizedPost>;
