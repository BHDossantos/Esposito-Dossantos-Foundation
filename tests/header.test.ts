import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, expect, vi } from 'vitest';
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => '/contact', Link: ({ children, ...props }: React.ComponentProps<'a'>) => React.createElement('a', props, children) }));
vi.mock('@/components/LocaleSwitcher', () => ({ default: () => null }));
import Header from '../src/components/Header';
it('keeps navigation readable over a dark hero before scrolling', () => {
  const html = renderToStaticMarkup(React.createElement(Header));
  expect(html).toMatch(/<header class="[^"]*bg-ivory\/95/);
  expect(html).toContain('aria-expanded="false"');
});
