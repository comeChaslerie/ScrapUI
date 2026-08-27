import { defineConfig } from 'vitest/config';

/**
 * Tests du schematic `ng-add`.
 *
 * À part du reste : le builder `@angular/build:unit-test` ne scanne que le
 * `sourceRoot` du projet, et fait tourner ses tests dans jsdom. Le schematic
 * manipule un arbre de fichiers côté Node — ni l'un ni l'autre ne convient.
 */
export default defineConfig({
  test: {
    name: 'schematics',
    globals: true,
    environment: 'node',
    include: ['projects/scrap-ui/schematics/**/*.spec.ts'],
  },
});
