import { Component, input } from '@angular/core';

export type ScrapTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Badge tampon avec tonalités sémantiques. */
@Component({
  selector: 'scrap-badge',
  template: `<ng-content />`,
  host: { '[class]': 'tone()' },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      padding: 0.25em 0.7em;
      border: var(--scrap-border-w) solid currentColor;
      transform: rotate(-2deg);
      color: var(--scrap-ink-strong);
    }
    :host(.info)    { color: var(--scrap-info); }
    :host(.success) { color: var(--scrap-success); }
    :host(.warning) { color: var(--scrap-warning); }
    :host(.danger)  { color: var(--scrap-danger); }
  `,
})
export class ScrapBadge {
  readonly tone = input<ScrapTone>('neutral');
}
