# Scrap UI

Direction artistique commune à tous les projets, dérivée de la charte graphique
Scrap Node (03/03/26). Librairie Angular : tokens, composants, layouts.

**Règle d'or : la palette et les typos sont fixes. Seul le logo change d'un projet à l'autre.**

## Direction artistique

| Élément | Valeur |
|---|---|
| Palette | `#000000` noir · `#322216` brun foncé · `#956140` cuivre · `#718993` bleu-gris · `#FFFFFF` blanc |
| Titres | Helvetica 900, capitales, léger désaxage « tampon » |
| Corps | Arial |
| Style | Grunge/récup : grain, bords déchirés, ombres dures, tampons |
| Thèmes | Clair et sombre (auto via OS, ou forcé par `data-scrap-theme` sur `<html>`) |

## Utilisation dans un projet

```bash
ng build scrap-ui
npm install /chemin/vers/scrap-ui/dist/scrap-ui   # ou npm link, ou publication npm
```

Dans `styles.scss` du projet :

```scss
@use 'scrap-ui/styles/index';
```

Dans un composant :

```ts
import { ScrapButton, ScrapCard, ScrapField, ScrapHeader, ScrapFooter, ScrapIcon, ScrapThemeToggle } from 'scrap-ui';
```

```html
<scrap-header appName="Mon Projet" [links]="links">
  <img logo src="assets/logo-du-projet.svg" alt="" />  <!-- slot logo : propre à chaque projet -->
  <scrap-theme-toggle actions />
</scrap-header>

<button scrap-button>Primaire</button>
<button scrap-button variant="secondary">Secondaire</button>
<button scrap-button variant="ghost">Fantôme</button>

<scrap-card title="Titre">contenu…</scrap-card>

<scrap-field label="Email" hint="optionnel">
  <input class="scrap-input" type="email" />
</scrap-field>

<scrap-footer appName="Mon Projet">…</scrap-footer>
```

Utilitaires CSS globaux : `.scrap-grain` (texture bruit), `.scrap-torn-bottom`
(bord déchiré), `.scrap-stamp` (badge tampon), `.scrap-rule` (séparateur pinceau),
`.scrap-hero-title`, `.scrap-input`.

Tous les tokens sont des CSS custom properties `--scrap-*`
(voir `projects/scrap-ui/src/styles/_tokens.scss`).

## Démo / vitrine

```bash
npx ng serve demo
```

→ http://localhost:4200 — montre palette, typos, composants et bascule clair/sombre.
