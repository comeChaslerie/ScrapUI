import { expect, test } from '@playwright/test';
import { STORIES, openStory, shot, type Theme } from './helpers';

const THEMES: Theme[] = ['light', 'dark'];

/**
 * Le socle : chaque story, dans chaque thème, en pleine page.
 *
 * C'est la couverture la plus rentable de la lib — la valeur d'une charte
 * graphique EST son rendu, et une régression de token se voit ici avant
 * d'atteindre un projet consommateur.
 */
for (const theme of THEMES) {
  test.describe(`vitrine — thème ${theme}`, () => {
    for (const story of STORIES) {
      test(story.title, async ({ page }) => {
        await openStory(page, story.path, theme);
        await expect(page).toHaveScreenshot(shot(`story-${story.path}`, theme), {
          fullPage: true,
        });
      });
    }
  });
}
