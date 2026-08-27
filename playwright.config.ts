import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;

/**
 * Régression visuelle sur la vitrine.
 *
 * La démo est servie en configuration de production : le mode développement
 * injecte des overlays et du live-reload qui pollueraient les captures.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Les références sont rangées par plateforme : le rendu du texte diffère
  // entre macOS et le Linux de la CI, et un dossier commun rendrait le test
  // rouge sur l'une ou l'autre en permanence. Voir `npm run visual:update:ci`.
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',

  expect: {
    toHaveScreenshot: {
      // Marge étroite : assez pour absorber l'antialiasing d'une machine à
      // l'autre, trop peu pour laisser passer un vrai décalage de style.
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    colorScheme: 'light',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],

  webServer: {
    command: `npm run build:demo && node e2e/static-server.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
