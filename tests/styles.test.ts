import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import config from '../tailwind.config';

it('compiles the existing branded stylesheet with its configured PostCSS plugin', async () => {
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
  const result = await postcss([tailwindcss({ ...config, content: [{ raw: '<div class="bg-ivory text-ink"></div>' }] })]).process(css, { from: undefined });
  expect(result.css).toContain('.bg-ivory');
  expect(result.css).not.toContain('@tailwind');
});
