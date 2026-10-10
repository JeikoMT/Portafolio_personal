// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

// /eventos solo entra al sitemap cuando hay fotos publicadas (DP-09).
const events = JSON.parse(readFileSync(new URL('./src/data/events.json', import.meta.url), 'utf8'));
const hasEvents = Array.isArray(events) && events.length > 0;

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap({ filter: (page) => hasEvents || !/\/eventos\/?$/.test(page) })],
  prefetch: false,
});
