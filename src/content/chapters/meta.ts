export type ChapterMeta = {
  slug: string;
  flag: string;
  cover: string;
};

export const chaptersMeta: ChapterMeta[] = [
  { slug: 'italy', flag: '🇮🇹', cover: 'from-[#1b2e4a] via-navy-800 to-navy-900' },
  { slug: 'brazil', flag: '🇧🇷', cover: 'from-[#1e3a3a] via-navy-800 to-navy-900' },
  { slug: 'portugal', flag: '🇵🇹', cover: 'from-[#243a5e] via-navy-700 to-navy-900' },
  { slug: 'spain', flag: '🇪🇸', cover: 'from-[#3a2a1e] via-navy-800 to-navy-900' },
  { slug: 'united-states', flag: '🇺🇸', cover: 'from-[#2a2140] via-navy-800 to-navy-900' }
];

export type LocalizedChapter = {
  name: string;
  region: string;
  tagline: string;
  description: string[];
  focus: string[];
};

export type ChapterContent = Record<string, LocalizedChapter>;
