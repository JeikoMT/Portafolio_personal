import { test, expect } from '@playwright/test';

// El diálogo solo existe si hay certificados de curso publicados (DP-04).
test.describe('Diálogo de certificados', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('CA-09: abre, cierra con Esc y con «Cerrar», y devuelve el foco', async ({ page }) => {
    await page.goto('/#certificados');
    const triggers = page.locator('[data-cert-open]');
    test.skip((await triggers.count()) === 0, 'Sin certificados de curso publicados (DP-04)');

    const first = triggers.first();
    await first.focus();
    await first.click();
    const dialog = page.locator('#cert-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Cerrar' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();

    await first.click();
    await dialog.getByRole('button', { name: 'Cerrar' }).click();
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
  });

  test('CA-10: imagen que falla muestra el mensaje exacto', async ({ page }) => {
    await page.goto('/#certificados');
    const triggers = page.locator('[data-cert-open]');
    test.skip((await triggers.count()) === 0, 'Sin certificados de curso publicados (DP-04)');

    await triggers.first().evaluate((el) => ((el as HTMLElement).dataset.forceError = 'true'));
    await triggers.first().click();
    await expect(page.getByRole('alert')).toHaveText('No se pudo cargar la imagen del certificado.');
  });
});
