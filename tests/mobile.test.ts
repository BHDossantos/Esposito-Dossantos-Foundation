import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// Load through Vitest so the website typecheck does not require the ephemeral CLI.
const configPath = resolve(root, 'capacitor.config.ts');
const read = (path: string) => readFileSync(resolve(root, path));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('mobile shell configuration', () => {
  it('keeps the existing app identity and HTTPS backing website', async () => {
    vi.stubEnv('CAP_SERVER_URL', '');
    const { default: config } = await import(configPath);
    expect(config.appId).toBe('org.espositodossantosfoundation.app');
    expect(config.appName).toBe('Esposito–Dossantos Foundation');
    expect(config.webDir).toBe('native/www');
    expect(config.server?.url).toBe('https://espositodossantosfoundation.org');
    expect(config.server?.androidScheme).toBe('https');
    expect(config.server?.cleartext).not.toBe(true);
  });

  it('can target a preview without changing the production default', async () => {
    vi.stubEnv('CAP_SERVER_URL', 'https://preview.example.test');
    const { default: config } = await import(configPath);
    expect(config.server?.url).toBe('https://preview.example.test');
    expect(config.appId).toBe('org.espositodossantosfoundation.app');
  });

  it('pins the native CLI to the locked runtime and platform versions', () => {
    const pkg = JSON.parse(read('package.json').toString());
    const lock = JSON.parse(read('package-lock.json').toString());
    const version = lock.packages['node_modules/@capacitor/core'].version;
    for (const platform of ['android', 'ios']) {
      expect(lock.packages[`node_modules/@capacitor/${platform}`].version).toBe(version);
    }
    for (const name of ['cap:add:android', 'cap:add:ios', 'cap:sync', 'cap:open:ios', 'cap:open:android']) {
      expect(pkg.scripts[name]).toContain(`@capacitor/cli@${version} `);
    }
  });
});

describe('packaged mobile resources', () => {
  it('includes a self-contained, mobile-sized offline page', () => {
    const html = read('native/www/index.html').toString();
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toContain('width=device-width');
    expect(html).toContain('viewport-fit=cover');
    expect(html).toContain("You're offline");
    expect(html).toContain('Try again');
    expect(html).not.toMatch(/<(?:script|link)\b[^>]*(?:src|href)=["']https?:/i);
  });

  it.each(['icon-only', 'icon-foreground', 'icon-background', 'splash', 'splash-dark'])(
    'includes nonempty PNG source art for %s', (name) => {
      const png = read(`assets/${name}.png`);
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(png.readUInt32BE(16)).toBeGreaterThanOrEqual(1024);
      expect(png.readUInt32BE(20)).toBeGreaterThanOrEqual(1024);
    }
  );
});
