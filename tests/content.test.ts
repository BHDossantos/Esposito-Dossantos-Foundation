import { describe, it, expect } from 'vitest';
import { getAllPosts, getAllSlugs, getPost } from '@/content/posts';
import { getAllEvents, getEvent } from '@/content/events';
import { getAllChapters, getChapter } from '@/content/chapters';
import type { Locale } from '@/i18n/routing';

const UNKNOWN = 'zz' as unknown as Locale;

describe('blog content', () => {
  it('returns posts for every locale', () => {
    for (const l of ['en', 'pt', 'it', 'es'] as Locale[]) {
      expect(getAllPosts(l).length).toBeGreaterThan(0);
    }
  });
  it('translates titles per locale', () => {
    const slug = getAllSlugs()[0];
    const en = getPost('en', slug);
    const it = getPost('it', slug);
    expect(en?.title).toBeTruthy();
    expect(it?.title).toBeTruthy();
    expect(en?.title).not.toBe(it?.title);
  });
  it('falls back to English for an unknown locale', () => {
    const slug = getAllSlugs()[0];
    expect(getPost(UNKNOWN, slug)?.title).toBe(getPost('en', slug)?.title);
  });
  it('returns null for an unknown slug', () => {
    expect(getPost('en', 'does-not-exist')).toBeNull();
  });
});

describe('events content', () => {
  it('returns events and translates them', () => {
    const en = getAllEvents('en');
    const es = getAllEvents('es');
    expect(en.length).toBeGreaterThan(0);
    expect(en.length).toBe(es.length);
    expect(getEvent(UNKNOWN, en[0].slug)?.title).toBe(en[0].title); // fallback
  });
});

describe('chapters content', () => {
  it('covers all five chapters and falls back for unknown locales', () => {
    const en = getAllChapters('en');
    expect(en.length).toBe(5);
    expect(getChapter(UNKNOWN, 'italy')?.name).toBe(getChapter('en', 'italy')?.name);
  });
});
