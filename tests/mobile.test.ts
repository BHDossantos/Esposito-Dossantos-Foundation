import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';

const original = process.env.CAP_SERVER_URL;
afterEach(() => {
  if (original === undefined) delete process.env.CAP_SERVER_URL;
  else process.env.CAP_SERVER_URL = original;
  vi.resetModules();
});

describe('native shell configuration', () => {
  it('routes remote failures to a bundled page with a real retry destination', async () => {
    delete process.env.CAP_SERVER_URL;
    const { default: config } = await import('../capacitor.config');
    expect(config.server?.errorPath).toBe('index.html');
    const fallback = readFileSync(`${config.webDir}/${config.server?.errorPath}`, 'utf8');
    expect(fallback).toContain("location.href='https://espositodossantosfoundation.org'");
    expect(fallback).not.toContain('location.reload()');
  });
  it.each(['http://example.com', 'https://user:password@example.com', 'invalid'])('rejects unsafe preview URL %s', async (url) => {
    process.env.CAP_SERVER_URL = url;
    await expect(import('../capacitor.config')).rejects.toThrow();
  });
  it('accepts HTTPS previews', async () => {
    process.env.CAP_SERVER_URL = 'https://preview.example.com';
    const { default: config } = await import('../capacitor.config');
    expect(config.server?.url).toBe('https://preview.example.com/');
  });
});
