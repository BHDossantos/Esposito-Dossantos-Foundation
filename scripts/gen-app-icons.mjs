import sharp from 'sharp';
import { mkdirSync } from 'fs';

// Generates the source app-icon and splash art for @capacitor/assets.
// The "H" is drawn as vector paths (no font dependency) so it renders
// identically everywhere. Brand: navy #0B1F3A, champagne #C9A86A.

mkdirSync('assets', { recursive: true });

const NAVY = '#0B1F3A';
const CHAMPAGNE = '#C9A86A';

// A serifed "H" monogram centered in a `size` viewBox, scaled by `s` (0..1).
function monogram(size, color, s = 0.42) {
  const cx = size / 2;
  const cy = size / 2;
  const h = size * s; // glyph height
  const barW = h * 0.19; // vertical bar width
  const gap = h * 0.42; // inner gap between bars
  const top = cy - h / 2;
  const left = cx - gap / 2 - barW;
  const right = cx + gap / 2;
  const crossY = cy - barW / 2;
  const serif = barW * 0.55; // serif foot overhang
  const serifH = barW * 0.5;
  const bars = [left, right]
    .map(
      (x) => `
      <rect x="${x}" y="${top}" width="${barW}" height="${h}" rx="${barW * 0.12}"/>
      <rect x="${x - serif}" y="${top}" width="${barW + serif * 2}" height="${serifH}" rx="${serifH * 0.3}"/>
      <rect x="${x - serif}" y="${top + h - serifH}" width="${barW + serif * 2}" height="${serifH}" rx="${serifH * 0.3}"/>`
    )
    .join('');
  const cross = `<rect x="${left}" y="${crossY}" width="${right + barW - left}" height="${barW}" rx="${barW * 0.12}"/>`;
  return `<g fill="${color}">${bars}${cross}</g>`;
}

async function png(svg, size, out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log('wrote', out);
}

const S = 1024;

// icon-only: full-bleed navy tile with the champagne monogram
const iconOnly = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${NAVY}"/>
  <rect x="96" y="96" width="${S - 192}" height="${S - 192}" rx="150" fill="none" stroke="${CHAMPAGNE}" stroke-width="10" opacity="0.35"/>
  ${monogram(S, CHAMPAGNE, 0.4)}
</svg>`;

// adaptive foreground (transparent) + background (solid navy) for Android
const iconFg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  ${monogram(S, CHAMPAGNE, 0.32)}
</svg>`;
const iconBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${NAVY}"/></svg>`;

// splash 2732×2732, monogram centered on the brand gradient
const SP = 2732;
const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="${SP}" height="${SP}" viewBox="0 0 ${SP} ${SP}">
  <defs><radialGradient id="g" cx="35%" cy="30%" r="80%">
    <stop offset="0%" stop-color="#15355f"/><stop offset="55%" stop-color="#0b1f3a"/><stop offset="100%" stop-color="#071528"/>
  </radialGradient></defs>
  <rect width="${SP}" height="${SP}" fill="url(#g)"/>
  ${monogram(SP, CHAMPAGNE, 0.14)}
</svg>`;

await png(iconOnly, S, 'assets/icon-only.png');
await png(iconFg, S, 'assets/icon-foreground.png');
await png(iconBg, S, 'assets/icon-background.png');
await png(splash, SP, 'assets/splash.png');
await png(splash, SP, 'assets/splash-dark.png');
console.log('done');
