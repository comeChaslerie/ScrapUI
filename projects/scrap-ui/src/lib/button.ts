import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ScrapButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Bouton Scrap : bloc massif, ombre portée dure, enfoncement au clic.
 * Variantes : primary (cuivre), secondary (bleu-gris), ghost (contour).
 */
@Component({
  selector: 'button[scrap-button], a[scrap-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    // Classes posées une par une : un binding `[class]` global écraserait
    // les classes que le consommateur pose lui-même sur l'élément.
    class: 'scrap-btn',
    '[class.scrap-btn--primary]': 'variant() === "primary"',
    '[class.scrap-btn--secondary]': 'variant() === "secondary"',
    '[class.scrap-btn--ghost]': 'variant() === "ghost"',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--scrap-space-2);
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: var(--scrap-fs-small);
      padding: 0.8em 1.6em;
      border: var(--scrap-border-w) solid var(--scrap-border);
      border-radius: var(--scrap-radius);
      cursor: pointer;
      text-decoration: none;
      box-shadow: var(--scrap-shadow);
      transition:
        transform var(--scrap-transition),
        box-shadow var(--scrap-transition);
    }
    :host(:hover) {
      transform: translate(-2px, -2px);
      box-shadow: var(--scrap-shadow-hover);
    }
    :host(:active) {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--scrap-border);
    }
    :host(:focus-visible) {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 3px;
    }
    :host(:disabled) {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: var(--scrap-shadow);
    }
    :host(.scrap-btn--primary) {
      background: var(--scrap-accent);
      color: var(--scrap-accent-ink);
    }
    :host(.scrap-btn--secondary) {
      background: var(--scrap-secondary);
      color: var(--scrap-secondary-ink);
    }
    :host(.scrap-btn--ghost) {
      background: transparent;
      color: var(--scrap-ink-strong);
    }
    @media (prefers-reduced-motion: reduce) {
      :host,
      :host(:hover),
      :host(:active) {
        transform: none;
        transition: none;
      }
    }
  `,
})
export class ScrapButton {
  readonly variant = input<ScrapButtonVariant>('primary');
}
