import { test, expect } from '@playwright/test';

test.describe('Proyectos', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('CA-06: 5 tarjetas con badge de estado y sin enlaces inexistentes', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#proyectos a.pcard');
    await expect(cards).toHaveCount(5);
    for (const card of await cards.all()) {
      await expect(card.locator('.badge')).toContainText(/Idea|Prototipo|En desarrollo|Terminado/);
      await expect(card).toHaveAttribute('href', /^\/proyectos\/[a-z-]+$/);
    }
    const idea = page.locator('#proyectos a.pcard', { hasText: 'Talent Hub' });
    await expect(idea.locator('.badge')).toHaveText('Idea');
  });

  test('CA-07: Talent Hub (Idea) solo muestra Contexto, Objetivo y Solución y no tiene botones de enlace', async ({ page }) => {
    await page.goto('/proyectos/talent-hub');
    await expect(page.getByRole('heading', { level: 1, name: 'Talent Hub' })).toBeVisible();
    const titles = await page.locator('article h2').allTextContents();
    expect(titles).toEqual(['Contexto', 'Objetivo', 'Solución']);
    await expect(page.getByText('Ver repositorio')).toHaveCount(0);
    await expect(page.getByText('Ver demo')).toHaveCount(0);
    await expect(page.getByText('Arquitectura')).toHaveCount(0);
  });

  test('DP-06: nunca se publica «Pendiente de documentar.»', async ({ page }) => {
    for (const slug of ['recruitment-analytics-database', 'dashboard-recruiting']) {
      await page.goto(`/proyectos/${slug}`);
      await expect(page.locator('main')).not.toContainText('Pendiente de documentar');
      await expect(page.locator('article h2', { hasText: 'Contexto' })).toHaveCount(0);
    }
  });

  test('CA-20: carrusel con flechas, puntos y teclado', async ({ page }) => {
    await page.goto('/proyectos/interviewnotes');
    const carousel = page.locator('[data-carousel]');
    await expect(carousel.locator('[data-counter]')).toHaveText('1 / 4');
    await expect(carousel.locator('[data-caption]')).toContainText('Pantalla: Procesos');

    await carousel.getByRole('button', { name: 'Imagen siguiente' }).click();
    await expect(carousel.locator('[data-counter]')).toHaveText('2 / 4');
    await expect(carousel.locator('[data-caption]')).toContainText('Pantalla: Detalle de proceso');
    await expect(carousel.locator('[data-slide]').nth(0)).toHaveAttribute('aria-hidden', 'true');
    await expect(carousel.locator('[data-slide]').nth(1)).toHaveAttribute('aria-hidden', 'false');

    await carousel.getByRole('button', { name: 'Ir a Métricas' }).click();
    await expect(carousel.locator('[data-counter]')).toHaveText('4 / 4');

    await carousel.locator('[data-carousel-stage]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(carousel.locator('[data-counter]')).toHaveText('1 / 4');
    await page.keyboard.press('ArrowLeft');
    await expect(carousel.locator('[data-counter]')).toHaveText('4 / 4');
  });

  test('las flechas del carrusel no dibujan un anillo de foco a pantalla media', async ({ page }) => {
    await page.goto('/proyectos/interviewnotes');
    const next = page.getByRole('button', { name: 'Imagen siguiente' });
    await next.focus();
    await page.keyboard.press('Tab');
    await next.focus();
    const outline = await next.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).toBe('none');
    const arrow = await next.locator('.carousel__arrow').evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(arrow).toBe('solid');
  });

  test('CA-21: índice lateral solo en ≥ 1024 px y con un enlace por sección', async ({ page }) => {
    await page.goto('/proyectos/interviewnotes');
    const toc = page.getByRole('navigation', { name: 'Índice del proyecto' });
    await expect(toc).toBeVisible();
    const sections = await page.locator('article h2').count();
    await expect(toc.getByRole('link')).toHaveCount(sections);

    await page.setViewportSize({ width: 800, height: 900 });
    await expect(toc).toBeHidden();
  });

  test('IX-08: sin repoUrl ni demoUrl no se renderizan botones', async ({ page }) => {
    await page.goto('/proyectos/interviewnotes');
    await expect(page.getByRole('link', { name: 'Ver repositorio' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Ver demo' })).toHaveCount(0);
  });

  test('CA-08: slug inexistente muestra la 404', async ({ page }) => {
    const response = await page.goto('/proyectos/xyz');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página no existe.' })).toBeVisible();
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');
  });

  test('CA-13: con movimiento reducido no hay transiciones', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/proyectos/interviewnotes');
    const duration = await page.locator('[data-slide]').first().evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(duration)).toBe(0);
    await context.close();
  });
});

test.describe('Eventos', () => {
  test('P-04 existe y no publica fotos sin autorización', async ({ page }) => {
    await page.goto('/eventos');
    await expect(page.getByRole('heading', { level: 1, name: 'Eventos corporativos' })).toBeVisible();
    const photos = page.locator('main img');
    const count = await photos.count();
    if (count === 0) {
      await expect(page.getByText('Pronto compartiré fotos de eventos.')).toBeVisible();
    } else {
      expect(count).toBe(5);
      for (const img of await photos.all()) {
        await expect(img).toHaveAttribute('alt', /^(?!.*(growby|ecommerce|vtex)).+$/i);
      }
    }
  });
});
