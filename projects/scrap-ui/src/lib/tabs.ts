import { Component, contentChildren, effect, input, signal } from '@angular/core';

/** Un onglet : <scrap-tab label="Détails">contenu</scrap-tab> */
@Component({
  selector: 'scrap-tab',
  template: `
    @if (active()) {
      <div class="scrap-stamp-in"><ng-content /></div>
    }
  `,
  styles: `:host { display: block; }`,
})
export class ScrapTab {
  readonly label = input.required<string>();
  readonly active = signal(false);
}

/**
 * Onglets façon étiquettes de classeur métallique.
 * <scrap-tabs><scrap-tab label="A">…</scrap-tab>…</scrap-tabs>
 */
@Component({
  selector: 'scrap-tabs',
  template: `
    <div role="tablist" class="rail">
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          role="tab"
          type="button"
          [attr.aria-selected]="tab.active()"
          [class.on]="tab.active()"
          (click)="select(i)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <div class="panel">
      <ng-content />
    </div>
  `,
  styles: `
    :host { display: block; }
    .rail {
      display: flex;
      gap: var(--scrap-space-2);
      flex-wrap: wrap;
      padding: 0 var(--scrap-space-2);
    }
    button {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      font-size: var(--scrap-fs-small);
      padding: 0.55em 1.1em;
      background: var(--scrap-bg-alt);
      color: var(--scrap-ink-muted);
      border: var(--scrap-border-w) solid var(--scrap-border);
      border-bottom: none;
      border-radius: var(--scrap-radius) var(--scrap-radius) 0 0;
      cursor: pointer;
      transform: translateY(2px);
      transition: transform var(--scrap-transition), background var(--scrap-transition);
    }
    button:hover { color: var(--scrap-ink); }
    button.on {
      background: var(--scrap-surface);
      color: var(--scrap-ink-strong);
      transform: translateY(var(--scrap-border-w));
      position: relative;
      z-index: 1;
    }
    button:focus-visible {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 2px;
    }
    .panel {
      background: var(--scrap-surface);
      border: var(--scrap-border-w) solid var(--scrap-border);
      box-shadow: var(--scrap-shadow);
      padding: var(--scrap-space-4);
    }
  `,
})
export class ScrapTabs {
  readonly tabs = contentChildren(ScrapTab);

  constructor() {
    // Active le premier onglet dès que la liste est connue.
    effect(() => {
      const list = this.tabs();
      if (list.length && !list.some((t) => t.active())) {
        list[0].active.set(true);
      }
    });
  }

  select(index: number): void {
    this.tabs().forEach((t, i) => t.active.set(i === index));
  }
}
