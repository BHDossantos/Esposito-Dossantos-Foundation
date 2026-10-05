import sharp from 'sharp';
import { mkdirSync } from 'fs';

// Generates the source app-icon and splash art for @capacitor/assets.
// Brand: navy #0B1F3A, champagne #C9A86A. Monogram: "ED" (Esposito–Dossantos).

mkdirSync('assets', { recursive: true });

const NAVY = '#0B1F3A';
const CHAMPAGNE = '#C9A86A';
const FONT = "Georgia, 'Times New Roman', 'DejaVu Serif', serif";

function wordmark(size, fontSize, color) {
  return `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
    font-family="${FONT}" font-weight="700" font-size="${fontSize}" fill="${color}"
    letter-spacing="${fontSize * 0.02}">ED</text>`;
}

async function png(svg, size, out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log('wrote', out);
}

const S = 1024;

const iconOnly = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${NAVY}"/>
  <rect x="96" y="96" width="${S - 192}" height="${S - 192}" rx="150" fill="none" stroke="${CHAMPAGNE}" stroke-width="10" opacity="0.35"/>
  ${wordmark(S, 420, CHAMPAGNE)}
</svg>`;

const iconFg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  ${wordmark(S, 330, CHAMPAGNE)}
</svg>`;
const iconBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${NAVY}"/></svg>`;

const SP = 2732;
const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="${SP}" height="${SP}" viewBox="0 0 ${SP} ${SP}">
  <defs><radialGradient id="g" cx="35%" cy="30%" r="80%">
    <stop offset="0%" stop-color="#15355f"/><stop offset="55%" stop-color="#0b1f3a"/><stop offset="100%" stop-color="#071528"/>
  </radialGradient></defs>
  <rect width="${SP}" height="${SP}" fill="url(#g)"/>
  ${wordmark(SP, 560, CHAMPAGNE)}
</svg>`;

await png(iconOnly, S, 'assets/icon-only.png');
await png(iconFg, S, 'assets/icon-foreground.png');
await png(iconBg, S, 'assets/icon-background.png');
await png(splash, SP, 'assets/splash.png');
await png(splash, SP, 'assets/splash-dark.png');
console.log('done');
