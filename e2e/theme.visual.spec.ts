import { expect, test } from '@playwright/test';
import { shot } from './helpers';

/**
 * La bascule de thème : le point le plus fragile de la charte, puisqu'elle
 * redéfinit tous les tokens d'un coup.
 */
test('la bascule inverse le thème et le mémorise', async ({ page }) => {
  // Pas d'openStory ici : son script d'initialisation réécrirait le stockage
  // à chaque chargement et masquerait précisément ce qu'on veut vérifier.
  await page.goto('/fondations');
  await page.waitForSelector('story-page h1');
  await expect(page.locator('html')).toHaveAttribute('data-scrap-theme', 'light');

  await page.getByRole('button', { name: 'Passer en mode sombre' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-scrap-theme', 'dark');
  await expect(page).toHaveScreenshot(shot('bascule-apres-clic', 'dark'), { fullPage: true });

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-scrap-theme', 'dark');
});

test('le thème système sombre est respecté sans choix explicite', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/fondations');
  await page.waitForSelector('story-page h1');
  await expect(page).toHaveScreenshot(shot('preference-systeme', 'dark'), { fullPage: true });
  await context.close();
});
