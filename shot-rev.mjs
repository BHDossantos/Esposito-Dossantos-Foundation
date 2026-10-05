import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user-Esposito-Dossantos-Foundation/3fe468f9-4e01-515d-9b26-2b5ffb7c12c1/scratchpad';
const browser = await chromium.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('edf-cookie-consent','accepted'); } catch {} });
const page = await ctx.newPage();
await page.goto('http://localhost:3251/', { waitUntil: 'networkidle', timeout: 30000 });
await page.addStyleTag({ content: '.opacity-0{opacity:1!important}.translate-y-6,.translate-y-24{transform:none!important}*{animation-duration:0s!important;transition-duration:0s!important}' });
await page.waitForTimeout(400);
// Header crop to show the wordmark
await page.screenshot({ path: `${OUT}/rev-header.jpg`, clip: { x: 0, y: 0, width: 1280, height: 110 }, type: 'jpeg', quality: 88 });
console.log('done');
await browser.close();
