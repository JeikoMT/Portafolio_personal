import type { APIRoute } from 'astro';

// El sitemap debe ser una URL absoluta; se arma con PUBLIC_SITE_URL (astro.config `site`).
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'http://localhost:4321');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
