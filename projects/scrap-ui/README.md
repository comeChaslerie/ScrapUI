# @comechaslerie/scrap-ui

Direction artistique commune aux projets **Scrap** — tokens CSS, composants et layouts
Angular 22 (standalone + signals). Charte grunge figée dérivée de Scrap Node.

> **Règle d'or : la palette et les typos sont fixes. Seul le logo change d'un projet à l'autre.**

## Installation

Le paquet vit sur GitHub Packages, qui exige un token **même en lecture**. Dans le projet
consommateur, un `.npmrc` versionné :

```ini
@comechaslerie:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

et un PAT classique avec la portée `read:packages` exposé en `GITHUB_PACKAGES_TOKEN` :

```bash
npm install @comechaslerie/scrap-ui
ng add @comechaslerie/scrap-ui    # branche le thème dans styles.scss
```

## Utilisation

```scss
// styles.scss
@use '@comechaslerie/scrap-ui/styles/index';
```

```ts
import { ScrapButton, ScrapCard, ScrapHeader } from '@comechaslerie/scrap-ui';
```

Thème clair/sombre automatique (OS), forçable via `data-scrap-theme` sur `<html>`.
Tous les tokens sont des custom properties `--scrap-*`.

## Prérequis côté consommateur

La lib est distribuée en compilation partielle Angular. Dans `angular.json`, deux réglages
évitent un `NG0203` (deux instances d'Angular chargées) :

```jsonc
"preserveSymlinks": true,
"prebundle": { "exclude": ["@comechaslerie/scrap-ui"] }
```

## Développement

```bash
ng build scrap-ui        # → dist/scrap-ui
ng serve demo            # vitrine de tous les composants
ng test scrap-ui         # vitest
```

Publication : voir [le README racine](../../README.md#publier-une-version) — un tag `vX.Y.Z`
déclenche le workflow `release`.

Composants et utilitaires CSS sont catalogués dans le [README racine](../../README.md).
