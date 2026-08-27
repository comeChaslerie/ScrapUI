import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { ScrapIdGenerator } from './id';

/** Un onglet : `<scrap-tab label="Détails">contenu</scrap-tab>` */
@Component({
  selector: 'scrap-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (active()) {
      <div class="scrap-stamp-in"><ng-content /></div>
    }
  `,
  host: {
    role: 'tabpanel',
    '[id]': 'panelId',
    '[attr.aria-labelledby]': 'tabId',
    '[attr.hidden]': 'active() ? null : ""',
    '[attr.tabindex]': 'active() ? 0 : null',
  },
  styles: `
    :host {
      display: block;
    }
    /* La règle [hidden] { display: none } vient de la feuille du navigateur,
       qu'un display posé par l'auteur écrase. Sans cette ligne, les panneaux
       inactifs restent exposés comme tabpanel aux lecteurs d'écran. */
    :host([hidden]) {
      display: none;
    }
    :host(:focus-visible) {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 3px;
    }
  `,
})
export class ScrapTab {
  readonly label = input.required<string>();

  private readonly ids = inject(ScrapIdGenerator);
  readonly panelId = this.ids.next('scrap-tabpanel');
  readonly tabId = `${this.panelId}-tab`;

  private readonly parent = inject(
    forwardRef(() => ScrapTabs),
    { optional: true },
  );

  /** Sans parent (onglet utilisé seul), le contenu reste visible. */
  readonly active = computed(() => {
    const parent = this.parent;
    if (!parent) return true;
    return parent.tabs().indexOf(this) === parent.selectedIndex();
  });
}

/**
 * Onglets façon étiquettes de classeur métallique.
 *
 * ```html
 * <scrap-tabs label="Fiche pièce">
 *   <scrap-tab label="Détails">…</scrap-tab>
 *   <scrap-tab label="Notes">…</scrap-tab>
 * </scrap-tabs>
 * ```
 *
 * Navigation clavier conforme au pattern ARIA « tabs » : flèches
 * gauche/droite, Origine/Fin, et `tabindex` mobile sur l'onglet actif.
 */
@Component({
  selector: 'scrap-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Le keydown est délégué : ce sont les boutons enfants qui portent le
         focus, la barre elle-même ne doit pas entrer dans l'ordre de tabulation. -->
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -->
    <div role="tablist" class="rail" [attr.aria-label]="label()" (keydown)="onKeydown($event)">
      @for (tab of tabs(); track tab.panelId; let i = $index) {
        <button
          #tabButton
          role="tab"
          type="button"
          [id]="tab.tabId"
          [attr.aria-selected]="i === selectedIndex()"
          [attr.aria-controls]="tab.panelId"
          [attr.tabindex]="i === selectedIndex() ? 0 : -1"
          [class.on]="i === selectedIndex()"
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
    :host {
      display: block;
    }
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
      transition:
        transform var(--scrap-transition),
        background var(--scrap-transition);
    }
    button:hover {
      color: var(--scrap-ink);
    }
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
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `,
})
export class ScrapTabs {
  /** Étiquette du groupe d'onglets, annoncée par les lecteurs d'écran. */
  readonly label = input<string>('Onglets');

  readonly tabs = contentChildren(ScrapTab);
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  private readonly requested = signal(0);

  /**
   * Index actif, borné à la liste réelle : plus besoin d'écrire dans un
   * signal depuis un `effect` pour activer le premier onglet.
   */
  readonly selectedIndex = computed(() => {
    const count = this.tabs().length;
    if (!count) return 0;
    return Math.max(0, Math.min(count - 1, this.requested()));
  });

  select(index: number): void {
    this.requested.set(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.tabs().length;
    if (!count) return;

    const current = this.selectedIndex();
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % count;
        break;
      case 'ArrowLeft':
        next = (current - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    this.tabButtons()[next]?.nativeElement.focus();
  }
}
