import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/proyectos/interviewnotes', '/proyectos/talent-hub', '/eventos', '/nope-404'];

test.describe('Accesibilidad (axe)', () => {
  for (const path of PAGES) {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      test(`${path} @${viewport.width}: sin violaciones serias`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(serious, JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), null, 2)).toEqual([]);
      });
    }
  }
});

test.describe('SEO (CA-16)', () => {
  for (const path of ['/', '/proyectos/interviewnotes', '/eventos']) {
    test(`${path}: title, description, canonical y og:image propios`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Jeiko Mendiguri|Eventos|InterviewNotes/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\/.+\.(png|jpg|webp)/);
    });
  }

  test('sitemap-index.xml, robots.txt y og-default.png responden', async ({ request }) => {
    expect((await request.get('/sitemap-index.xml')).ok()).toBe(true);
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('Sitemap:');
    expect((await request.get('/og/og-default.png')).ok()).toBe(true);
  });

  test('la analítica solo se carga con token', async ({ page }) => {
    await page.goto('/');
    const token = process.env.PUBLIC_CF_ANALYTICS_TOKEN;
    const count = await page.locator('script[src*="cloudflareinsights"]').count();
    expect(count).toBe(token ? 1 : 0);
  });
});
