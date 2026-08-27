import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Gabarit commun à toutes les stories : titre, chapeau, et blocs de démo.
 *
 * Les stories sont volontairement déterministes (aucun `Math.random`, aucune
 * animation en boucle par défaut) : elles servent aussi de référence aux
 * tests de régression visuelle.
 */
@Component({
  selector: 'story-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article>
      <h1>{{ title() }}</h1>
      @if (lead()) {
        <p class="lead">{{ lead() }}</p>
      }
      <ng-content />
    </article>
  `,
  styles: `
    :host {
      display: block;
      max-width: 76rem;
      margin: 0 auto;
      padding: var(--scrap-space-5) var(--scrap-space-4) var(--scrap-space-6);
    }
    .lead {
      max-width: 62ch;
      color: var(--scrap-ink-muted);
      font-size: 1.05rem;
      margin: 0 0 var(--scrap-space-5);
    }
  `,
})
export class StoryPage {
  readonly title = input.required<string>();
  readonly lead = input<string>();
}

/** Un cas de démonstration isolé, avec sa légende. */
@Component({
  selector: 'story-case',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ name() }}</h2>
    @if (note()) {
      <p class="note">{{ note() }}</p>
    }
    <div class="stage" [class.stack]="stack()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: var(--scrap-space-5);
    }
    h2 {
      font-size: var(--scrap-fs-h3);
      margin-bottom: var(--scrap-space-2);
    }
    .note {
      margin: 0 0 var(--scrap-space-3);
      color: var(--scrap-ink-muted);
      font-size: var(--scrap-fs-small);
      max-width: 62ch;
    }
    .stage {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--scrap-space-4);
      padding: var(--scrap-space-4);
      border: var(--scrap-border-w) dashed var(--scrap-border-soft);
      border-radius: var(--scrap-radius);
    }
    .stage.stack {
      flex-direction: column;
      align-items: stretch;
    }
  `,
})
export class StoryCase {
  readonly name = input.required<string>();
  readonly note = input<string>();
  /** Empile les cas verticalement plutôt qu'en ligne. */
  readonly stack = input(false);
}
