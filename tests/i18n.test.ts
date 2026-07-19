import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const LOCALES = ['en', 'pt', 'it', 'es'] as const;
const dir = path.join(process.cwd(), 'messages');

function load(locale: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(dir, `${locale}.json`), 'utf8'));
}

function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [];
  let out: string[] = [];
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      out = out.concat(keys(item, `${prefix}[${i}]`));
    });
    return out;
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const np = prefix ? `${prefix}.${k}` : k;
    out.push(np);
    out = out.concat(keys(v, np));
  }
  return out;
}

function icuPlaceholders(obj: unknown): Set<string> {
  const found = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(/\{(\w+)\}/g)) found.add(m[1]);
    } else if (v && typeof v === 'object') {
      Object.values(v as Record<string, unknown>).forEach(walk);
    }
  };
  walk(obj);
  return found;
}

describe('i18n message catalogs', () => {
  const en = load('en');
  const enKeys = new Set(keys(en));
  const enPlaceholders = icuPlaceholders(en);

  for (const locale of LOCALES.filter((l) => l !== 'en')) {
    it(`${locale} has key-for-key parity with en`, () => {
      const mk = new Set(keys(load(locale)));
      const missing = [...enKeys].filter((k) => !mk.has(k));
      const extra = [...mk].filter((k) => !enKeys.has(k));
      expect(missing, `missing keys in ${locale}`).toEqual([]);
      expect(extra, `extra keys in ${locale}`).toEqual([]);
    });

    it(`${locale} preserves the same ICU placeholders`, () => {
      expect(icuPlaceholders(load(locale))).toEqual(enPlaceholders);
    });

    it(`${locale} keeps the brand name with the en-dash`, () => {
      const raw = fs.readFileSync(path.join(dir, `${locale}.json`), 'utf8');
      expect(raw).toContain('Esposito–Dossantos');
    });
  }

  it('en defines the expected top-level namespaces', () => {
    for (const ns of ['nav', 'home', 'mission', 'donate', 'blog', 'events', 'portal', 'sponsors']) {
      expect(enKeys.has(ns)).toBe(true);
    }
  });
});
