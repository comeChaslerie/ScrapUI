import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Carte Scrap : plaque bordée avec ombre dure et grain,
 * en-tête optionnel façon étiquette rivetée.
 */
@Component({
  selector: 'scrap-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <div class="card-head">
        <span class="rivet"></span>
        <h3>{{ title() }}</h3>
        <span class="rivet"></span>
      </div>
    }
    <div class="card-body scrap-grain">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--scrap-surface);
      border: var(--scrap-border-w) solid var(--scrap-border);
      border-radius: var(--scrap-radius);
      box-shadow: var(--scrap-shadow);
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--scrap-space-3);
      padding: var(--scrap-space-2) var(--scrap-space-3);
      background: var(--scrap-ink-strong);
      border-bottom: var(--scrap-border-w) solid var(--scrap-border);
    }
    .card-head h3 {
      margin: 0;
      color: var(--scrap-bg);
      font-size: var(--scrap-fs-small);
      letter-spacing: 0.1em;
    }
    .rivet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--scrap-copper);
      flex: none;
    }
    .card-body {
      padding: var(--scrap-space-4);
    }
  `,
})
export class ScrapCard {
  readonly title = input<string>();
}
