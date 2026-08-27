import { expect, test } from '@playwright/test';
import { openStory } from './helpers';

/**
 * Comportements que les tests unitaires ne peuvent pas prouver : ils
 * dépendent du navigateur (`<dialog>` natif, propagation des événements de
 * pointeur, focus) et non de la seule logique des composants.
 */

test.describe('toasts', () => {
  test('le survol suspend vraiment la disparition', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    await page.getByRole('button', { name: 'success', exact: true }).click();

    const toast = page.locator('scrap-toasts .toast');
    await expect(toast).toHaveCount(1);

    // L'hôte <scrap-toasts> est en `pointer-events: none` ; c'est le toast
    // qui reçoit le pointeur. Ce test vérifie que `mouseenter` remonte bien
    // jusqu'à l'hôte, où la pause est câblée.
    await toast.hover();
    await page.waitForTimeout(5000); // au-delà des 3,5 s de durée par défaut
    await expect(toast).toHaveCount(1);

    await page.mouse.move(0, 0);
    await expect(toast).toHaveCount(0, { timeout: 5000 });
  });

  test('le toast se ferme au clavier', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    await page.getByRole('button', { name: 'info', exact: true }).click();

    const toast = page.locator('scrap-toasts .toast');
    await toast.getByRole('button', { name: 'Fermer' }).focus();
    await page.keyboard.press('Enter');
    await expect(toast).toHaveCount(0);
  });

  test('le focus dans la pile suspend aussi la disparition', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    await page.getByRole('button', { name: 'warning', exact: true }).click();

    const toast = page.locator('scrap-toasts .toast');
    await toast.getByRole('button', { name: 'Fermer' }).focus();
    await page.waitForTimeout(5000);
    await expect(toast).toHaveCount(1);
  });
});

test.describe('modale', () => {
  test('Échap ferme et rend le défilement', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    await page.getByRole('button', { name: 'Ouvrir la modale' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('le focus est piégé dans la modale', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    const opener = page.getByRole('button', { name: 'Ouvrir la modale' });
    await opener.click();
    // Sans cette attente, la première tabulation part avant l'ouverture et
    // le test devient instable.
    await expect(page.getByRole('dialog')).toBeVisible();

    // Le piège vient du <dialog> natif : quel que soit le nombre de
    // tabulations, le focus ne doit jamais ressortir vers la page.
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    const inDialog = await page.evaluate(() => document.activeElement?.closest('dialog') !== null);
    expect(inDialog).toBe(true);
  });

  test('le focus revient sur le déclencheur à la fermeture', async ({ page }) => {
    await openStory(page, 'modale-toasts');
    const opener = page.getByRole('button', { name: 'Ouvrir la modale' });
    await opener.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });
});

test.describe('onglets', () => {
  test('les flèches déplacent le focus avec la sélection', async ({ page }) => {
    await openStory(page, 'onglets');
    const tabs = page.locator('scrap-tabs').first();

    await tabs.getByRole('tab', { name: 'Détails' }).focus();
    await page.keyboard.press('ArrowRight');

    await expect(tabs.getByRole('tab', { name: 'Historique' })).toBeFocused();
    await expect(tabs.getByRole('tabpanel')).toContainText('Entré le 12/01');
  });

  test("un seul panneau est exposé à l'arbre d'accessibilité", async ({ page }) => {
    await openStory(page, 'onglets');
    const tabs = page.locator('scrap-tabs').first();

    // `hidden` ne suffit pas : le `:host { display: block }` du composant
    // écrase la règle du navigateur. Sans `:host([hidden])`, les trois
    // panneaux sont annoncés, dont deux vides.
    await expect(tabs.getByRole('tabpanel')).toHaveCount(1);

    await tabs.getByRole('tab', { name: 'Notes' }).click();
    await expect(tabs.getByRole('tabpanel')).toHaveCount(1);
    await expect(tabs.getByRole('tabpanel')).toContainText('ressoudure');
  });

  test('une seule tabulation traverse la barre', async ({ page }) => {
    await openStory(page, 'onglets');
    const tabs = page.locator('scrap-tabs').first();
    await tabs.getByRole('tab', { name: 'Détails' }).focus();

    // Grâce au tabindex mobile, Tab quitte la barre au lieu de visiter
    // chacun des onglets un par un.
    await page.keyboard.press('Tab');
    await expect(tabs.getByRole('tab', { name: 'Historique' })).not.toBeFocused();
  });
});
