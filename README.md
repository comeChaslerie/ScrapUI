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
| Style | Grunge/récup : grain, bords déchirés, ombres dures, tampons, éclaboussures |
| Sémantiques | erreur `rouille #8a3324` · succès `mousse #5f7a3f` · avertissement `ocre #b3822f` · info `bleu-gris` |
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

Ou en une commande une fois la lib installée : `ng add scrap-ui` (ajoute l'import du thème dans styles.scss).

Dans un composant :

```ts
import {
  ScrapBadge, ScrapButton, ScrapCard, ScrapEmptyState, ScrapErrorPage,
  ScrapField, ScrapFooter, ScrapHeader, ScrapIcon, ScrapModal, ScrapSpinner,
  ScrapSplat, ScrapTab, ScrapTabs, ScrapThemeToggle, ScrapToast, ScrapToasts,
} from 'scrap-ui';
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

<!-- Badges sémantiques -->
<scrap-badge tone="success">OK</scrap-badge>

<!-- Onglets -->
<scrap-tabs>
  <scrap-tab label="Détails">…</scrap-tab>
  <scrap-tab label="Notes">…</scrap-tab>
</scrap-tabs>

<!-- Modale (deux-way binding sur un signal) -->
<scrap-modal [(open)]="showModal" title="Confirmer">
  contenu…
  <div actions><button scrap-button>OK</button></div>
</scrap-modal>

<!-- Toasts : poser <scrap-toasts /> dans le layout racine, puis
     inject(ScrapToast).show('Enregistré', 'success') -->
<scrap-toasts />

<!-- Loader, état vide, page d'erreur, décor -->
<scrap-spinner label="Chargement…" />
<scrap-empty-state message="Aucun résultat"><button scrap-button>Créer</button></scrap-empty-state>
<scrap-error-page code="404"><a scrap-button href="/">Retour</a></scrap-error-page>
<scrap-splat name="burst" [size]="200" style="color: var(--scrap-copper)" />

<!-- Curseur de réglage : two-way binding, crans optionnels, icône projetée -->
<scrap-slider [(value)]="volume" [step]="10" [ticks]="true">
  <scrap-icon icon name="volume" />
</scrap-slider>

<!-- Audio : forme d'onde cliquable, oscilloscope, VU-mètre (données 0..1) -->
<scrap-wave-bars [data]="peaks" [progress]="progress()" (seek)="onSeek($event)" />
<scrap-wave-line [data]="samples" />
<scrap-vu-meter [level]="0.7" />
<!-- Temps réel depuis Web Audio : mode "line" (oscilloscope) ou "bars" (spectre) -->
<scrap-wave-live [analyser]="analyserNode" mode="line" />
```

Curseurs personnalisés (classes globales à poser sur n'importe quelle zone) :
`.scrap-cursor-cross`, `.scrap-cursor-wrench`, `.scrap-cursor-marker`,
`.scrap-cursor-spray`, `.scrap-cursor-gear`.

Utilitaires CSS globaux : `.scrap-grain` (texture bruit), `.scrap-torn-bottom`
(bord déchiré), `.scrap-stamp` (badge tampon), `.scrap-rule` (séparateur pinceau),
`.scrap-hero-title`, `.scrap-input`, `.scrap-select`, `.scrap-checkbox`,
`.scrap-radio`, `.scrap-choice`, `.scrap-table`, et animations `.scrap-stamp-in`
(coup de tampon), `.scrap-reveal` (apparition au scroll), `.scrap-jitter` (tremblement au survol).

Assets fournis (`node_modules/scrap-ui/assets/`) : `favicon.svg` et
`manifest.webmanifest` (template — remplacer le nom du projet).

## Publication npm (quand tu seras prêt)

```bash
ng build scrap-ui
cd dist/scrap-ui
npm publish --access restricted   # nécessite un compte npm / registre privé
```

En attendant, l'install par chemin local ou `npm link` fonctionne très bien.

Tous les tokens sont des CSS custom properties `--scrap-*`
(voir `projects/scrap-ui/src/styles/_tokens.scss`).

## Démo / vitrine

```bash
npx ng serve demo
```

→ http://localhost:4200 — montre palette, typos, composants et bascule clair/sombre.
