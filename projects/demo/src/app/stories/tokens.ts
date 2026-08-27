import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-tokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase],
  template: `
    <story-page
      title="Fondations"
      lead="Palette figée, typographies, espacements. Tout est exposé en variables CSS --scrap-*."
    >
      <story-case name="Palette de la charte">
        @for (c of palette; track c.token) {
          <figure>
            <span class="swatch" [style.background]="'var(' + c.token + ')'"></span>
            <figcaption>
              <strong>{{ c.name }}</strong
              ><br />
              <code>{{ c.token }}</code>
            </figcaption>
          </figure>
        }
      </story-case>

      <story-case name="Couleurs sémantiques">
        @for (c of semantic; track c.token) {
          <figure>
            <span class="swatch" [style.background]="'var(' + c.token + ')'"></span>
            <figcaption>
              <strong>{{ c.name }}</strong
              ><br />
              <code>{{ c.token }}</code>
            </figcaption>
          </figure>
        }
      </story-case>

      <story-case name="Surfaces et encres">
        @for (c of surfaces; track c.token) {
          <figure>
            <span class="swatch bordered" [style.background]="'var(' + c.token + ')'"></span>
            <figcaption>
              <code>{{ c.token }}</code>
            </figcaption>
          </figure>
        }
      </story-case>

      <story-case name="Échelle typographique" [stack]="true">
        <p class="scrap-hero-title">Hero</p>
        <h1>Titre de niveau 1</h1>
        <h2>Titre de niveau 2</h2>
        <h3>Titre de niveau 3</h3>
        <p>Corps de texte en Arial, interligne 1.6, pour les paragraphes courants.</p>
        <p style="font-size: var(--scrap-fs-small)">Texte secondaire.</p>
      </story-case>

      <story-case name="Espacements" [stack]="true">
        @for (s of spaces; track s) {
          <div class="space-row">
            <code>--scrap-space-{{ s }}</code>
            <span class="bar" [style.width]="'var(--scrap-space-' + s + ')'"></span>
          </div>
        }
      </story-case>
    </story-page>
  `,
  styles: `
    figure {
      margin: 0;
      width: 9rem;
    }
    .swatch {
      display: block;
      height: 5rem;
      border-radius: var(--scrap-radius);
      box-shadow: var(--scrap-shadow);
    }
    .swatch.bordered {
      border: var(--scrap-border-w) solid var(--scrap-border);
    }
    figcaption {
      margin-top: var(--scrap-space-2);
      font-size: 0.75rem;
      color: var(--scrap-ink-muted);
      line-height: 1.4;
    }
    figcaption strong {
      color: var(--scrap-ink);
    }
    .space-row {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-3);
      font-size: 0.75rem;
    }
    .space-row code {
      min-width: 11rem;
      color: var(--scrap-ink-muted);
    }
    .bar {
      height: 1rem;
      background: var(--scrap-accent);
      display: inline-block;
    }
  `,
})
export class TokensStory {
  readonly palette = [
    { name: 'Noir', token: '--scrap-black' },
    { name: 'Brun foncé', token: '--scrap-bark' },
    { name: 'Cuivre', token: '--scrap-copper' },
    { name: 'Bleu-gris', token: '--scrap-steel' },
    { name: 'Blanc', token: '--scrap-white' },
  ];

  readonly semantic = [
    { name: 'Erreur — rouille', token: '--scrap-danger' },
    { name: 'Succès — mousse', token: '--scrap-success' },
    { name: 'Alerte — ocre', token: '--scrap-warning' },
    { name: 'Info — bleu-gris', token: '--scrap-info' },
  ];

  readonly surfaces = [
    { token: '--scrap-bg' },
    { token: '--scrap-bg-alt' },
    { token: '--scrap-surface' },
    { token: '--scrap-ink' },
    { token: '--scrap-ink-muted' },
    { token: '--scrap-border-soft' },
  ];

  readonly spaces = [1, 2, 3, 4, 5, 6];
}
