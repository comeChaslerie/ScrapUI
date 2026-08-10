import { Component, input, model } from '@angular/core';
import { ScrapIcon } from './icon';

/**
 * Modale : plaque désaxée qui claque façon tampon, overlay grainé.
 *
 * <scrap-modal [(open)]="showModal" title="Confirmer">
 *   contenu…
 *   <div slot-actions actions>…boutons…</div>
 * </scrap-modal>
 */
@Component({
  selector: 'scrap-modal',
  imports: [ScrapIcon],
  template: `
    @if (open()) {
      <div class="overlay scrap-grain" (click)="dismiss()">
        <div
          class="plate scrap-stamp-in"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          (click)="$event.stopPropagation()"
        >
          <div class="head">
            <h3>{{ title() }}</h3>
            <button type="button" class="x" aria-label="Fermer" (click)="dismiss()">
              <scrap-icon name="close" [size]="18" />
            </button>
          </div>
          <div class="body">
            <ng-content />
          </div>
          <div class="actions">
            <ng-content select="[actions]" />
          </div>
        </div>
      </div>
    }
  `,
  host: { '(document:keydown.escape)': 'open() && dismiss()' },
  styles: `
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: var(--scrap-space-4);
      background: rgb(0 0 0 / 0.55);
    }
    .plate {
      width: min(520px, 100%);
      background: var(--scrap-surface);
      border: var(--scrap-border-w) solid var(--scrap-border);
      box-shadow: 8px 8px 0 rgb(0 0 0 / 0.6);
      rotate: -1deg;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--scrap-space-2) var(--scrap-space-3);
      background: var(--scrap-ink-strong);
    }
    .head h3 {
      margin: 0;
      color: var(--scrap-bg);
      font-size: var(--scrap-fs-small);
      letter-spacing: 0.1em;
    }
    .x {
      background: none;
      border: none;
      color: var(--scrap-copper);
      cursor: pointer;
      padding: 2px;
      display: inline-flex;
    }
    .x:hover { color: var(--scrap-bg); }
    .body { padding: var(--scrap-space-4); }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--scrap-space-3);
      padding: 0 var(--scrap-space-4) var(--scrap-space-4);
    }
    .actions:empty { display: none; }
  `,
})
export class ScrapModal {
  readonly open = model(false);
  readonly title = input.required<string>();

  dismiss(): void {
    this.open.set(false);
  }
}
