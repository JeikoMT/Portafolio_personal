// Genera public/og/og-default.png (1200x630) con el monograma JM, el nombre y el titular.
// Uso: node scripts/make-og.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="12%" cy="10%" r="55%"><stop offset="0" stop-color="#DBEAFE"/><stop offset="1" stop-color="#F5F8FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="92%" cy="85%" r="55%"><stop offset="0" stop-color="#E0F2FE"/><stop offset="1" stop-color="#F5F8FF" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#1D4ED8"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#F5F8FF"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <rect x="96" y="96" width="112" height="112" rx="30" fill="#0B1B3A"/>
  <text x="152" y="170" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" text-anchor="middle" fill="#FFFFFF">JM</text>
  <text x="96" y="330" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="700" fill="#0B1B3A">Jeiko Mendiguri</text>
  <text x="96" y="420" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="#0B1B3A">IT Recruiter &amp; <tspan fill="url(#t)">Talent Acquisition</tspan></text>
  <text x="96" y="500" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#475569">Psicología, datos y tecnología aplicados a la selección de talento.</text>
</svg>`;

mkdirSync('public/og', { recursive: true });
await sharp(Buffer.from(svg)).png().toFile('public/og/og-default.png');
console.log('public/og/og-default.png');
