import { test, expect } from '@playwright/test';

const WA =
  'https://wa.me/51948331981?text=Hola%20Jeiko%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20conversar.';

test.describe('P-01 en móvil (360 px)', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('CA-01: nombre, titular y «Ver proyectos» visibles sin scroll', async ({ page }) => {
    await page.goto('/');
    for (const locator of [
      page.getByRole('heading', { level: 1, name: 'Jeiko Mendiguri' }),
      page.getByText('IT Recruiter &', { exact: false }).first(),
      page.getByRole('link', { name: 'Ver proyectos' }),
    ]) {
      await expect(locator).toBeInViewport();
    }
  });

  test('CA-03: ninguna franja provoca scroll horizontal de la página y todas son alcanzables con Tab', async ({ page }) => {
    await page.goto('/#herramientas');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const regions = page.locator('#herramientas [role="region"][tabindex="0"]');
    await expect(regions).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await regions.nth(i).focus();
      await expect(regions.nth(i)).toBeFocused();
    }
    const scrollable = await regions.nth(0).evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
  });

  test('la navbar cabe en 360 px y el botón «Menú» es visible por completo', async ({ page }) => {
    await page.goto('/');
    const box = await page.getByRole('button', { name: 'Menú' }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('menú móvil: aria-expanded, cierra con Esc y al elegir un enlace', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: /Menú|Cerrar/ });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-movil')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await page.locator('#menu-movil').getByRole('link', { name: 'Proyectos' }).click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('P-01 en escritorio (1440 px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('CA-02: solo las cifras 4+ / 6 / 5', async ({ page }) => {
    await page.goto('/');
    const stats = page.getByLabel('Cifras').locator('li');
    await expect(stats).toHaveCount(3);
    await expect(stats.nth(0)).toContainText('4+');
    await expect(stats.nth(0)).toContainText('años en selección');
    await expect(stats.nth(1)).toContainText('6');
    await expect(stats.nth(1)).toContainText('organizaciones');
    await expect(stats.nth(2)).toContainText('5');
    await expect(stats.nth(2)).toContainText('sectores');
  });

  test('CA-12: WhatsApp del hero y de Contacto abren wa.me en pestaña nueva', async ({ page }) => {
    await page.goto('/');
    const links = page.locator(`a[href="${WA}"]`);
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('IX-02, IX-04, IX-05: hrefs exactos de contacto', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('#contacto');
    await expect(contact.locator('a[href="mailto:jeikomt1997@gmail.com"]')).toHaveCount(1);
    await expect(contact.locator('a[href="tel:+51948331981"]')).toHaveCount(1);
    const linkedin = contact.locator('a[href="https://www.linkedin.com/in/jeiko-mendiguri-tovar-812624232"]');
    await expect(linkedin).toHaveAttribute('target', '_blank');
    await expect(page.locator('footer a[href="https://www.linkedin.com/in/jeiko-mendiguri-tovar-812624232"]')).toHaveCount(1);
  });

  test('CA-18: el teléfono se copia y la fila muestra «Teléfono · Copiado» 2 s', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const row = page.locator('#contacto a[href="tel:+51948331981"]');
    await row.click();
    await expect(row).toContainText('Teléfono · Copiado');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('+51948331981');
    await expect(row).not.toContainText('Copiado', { timeout: 4000 });
    await expect(row).toContainText('Teléfono');
  });

  test('CA-04 y CA-17: niveles en palabras y tarjetas de IA completas', async ({ page }) => {
    await page.goto('/');
    const tools = page.locator('#herramientas');
    await expect(tools).not.toContainText('%');
    const cards = tools.locator('article');
    await expect(cards).toHaveCount(7);
    for (const card of await cards.all()) {
      await expect(card.locator('h3')).not.toBeEmpty();
      await expect(card.locator('p')).not.toBeEmpty();
      await expect(card.locator('.badge')).toContainText(/Uso práctico|En aprendizaje/);
      await expect(card).not.toContainText(/GrowBy|Canvia/);
    }
  });

  test('CA-05: 6 empresas y bloque secundario de psicología clínica', async ({ page }) => {
    await page.goto('/');
    const jobs = page.locator('#experiencia ol > li');
    await expect(jobs).toHaveCount(6);
    await expect(jobs.nth(0)).toContainText('IT Recruiter');
    await expect(jobs.nth(0)).toContainText('GrowBy');
    await expect(page.locator('#experiencia aside')).toContainText('Practicante de Psicología Clínica');
    const sectors = new Set(
      await jobs.locator('.job__sector').allTextContents(),
    );
    expect(sectors.size).toBe(5);
  });

  test('CA-11: constancias solo texto con «Constancia disponible a solicitud»', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#certificados .constancia');
    await expect(items).toHaveCount(4);
    for (const item of await items.all()) {
      await expect(item.locator('img')).toHaveCount(0);
      await expect(item).toContainText('Constancia disponible a solicitud');
    }
  });

  test('CA-15: colecciones visibles y estado de publicaciones', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#h-areas')).toBeVisible();
    await expect(page.locator('section[aria-labelledby="h-areas"] .area')).toHaveCount(4);
    await expect(page.locator('section[aria-labelledby="h-met"] .step')).toHaveCount(5);
    await expect(page.locator('section[aria-labelledby="h-eval"] .group')).toHaveCount(5);
    await expect(page.locator('section[aria-labelledby="h-form"] .edu__card')).toHaveCount(2);
    await expect(page.locator('#publicaciones article')).toHaveCount(2);
    await expect(page.locator('#publicaciones a[target="_blank"]')).toHaveCount(2);
  });

  test('RN-10: todos los enlaces externos usan noopener noreferrer', async ({ page }) => {
    await page.goto('/');
    const external = page.locator('a[href^="http"]');
    for (const a of await external.all()) {
      await expect(a).toHaveAttribute('rel', /noopener noreferrer/);
    }
  });
});
