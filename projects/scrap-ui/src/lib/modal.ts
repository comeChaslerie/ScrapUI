import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrapIcon } from './icon';
import { ScrapIdGenerator } from './id';
import { ScrapScrollLock } from './scroll-lock';

/**
 * Modale : plaque désaxée qui claque façon tampon, overlay grainé.
 *
 * ```html
 * <scrap-modal [(open)]="showModal" title="Confirmer">
 *   contenu…
 *   <div actions>…boutons…</div>
 * </scrap-modal>
 * ```
 *
 * S'appuie sur le `<dialog>` natif : piège de focus, restauration du focus
 * à la fermeture, fermeture par Échap et inertage de l'arrière-plan sont
 * fournis par le navigateur — rien à réimplémenter.
 */
@Component({
  selector: 'scrap-modal',
  imports: [ScrapIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Le clic sur le fond a son équivalent clavier : Échap, géré nativement
         par <dialog>. L'élément n'a donc pas à être focusable lui-même. -->
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <dialog
      #dialog
      [attr.aria-labelledby]="titleId"
      (close)="open.set(false)"
      (click)="onClick($event)"
    >
      <div class="plate scrap-stamp-in">
        <div class="head">
          <h3 [id]="titleId">{{ title() }}</h3>
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
    </dialog>
  `,
  styles: `
    dialog {
      padding: 0;
      border: none;
      background: transparent;
      max-width: min(520px, calc(100vw - 2 * var(--scrap-space-4)));
      max-height: calc(100vh - 2 * var(--scrap-space-4));
      overflow: visible;
      color: var(--scrap-ink);
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.55);
    }
    .plate {
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
    .x:hover {
      color: var(--scrap-bg);
    }
    .x:focus-visible {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 2px;
    }
    .body {
      padding: var(--scrap-space-4);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--scrap-space-3);
      padding: 0 var(--scrap-space-4) var(--scrap-space-4);
    }
    .actions:empty {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .plate {
        rotate: none;
      }
    }
  `,
})
export class ScrapModal {
  readonly open = model(false);
  readonly title = input.required<string>();

  protected readonly titleId = inject(ScrapIdGenerator).next('scrap-modal-title');

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly scrollLock = inject(ScrapScrollLock);

  /** Fonction de libération du verrou de défilement tant que la modale est ouverte. */
  private release: (() => void) | null = null;

  constructor() {
    // Une navigation peut détruire la vue modale ouverte : sans ça, la page
    // resterait verrouillée pour de bon.
    inject(DestroyRef).onDestroy(() => this.unlock());

    effect(() => {
      const el = this.dialog()?.nativeElement;
      const shouldOpen = this.open();
      if (!this.isBrowser || !el) return;

      if (shouldOpen && !el.open) el.showModal();
      else if (!shouldOpen && el.open) el.close();

      if (shouldOpen) this.release ??= this.scrollLock.acquire();
      else this.unlock();
    });
  }

  private unlock(): void {
    this.release?.();
    this.release = null;
  }

  dismiss(): void {
    this.open.set(false);
  }

  /** Clic sur le fond : la cible est le <dialog> lui-même, pas la plaque. */
  protected onClick(event: MouseEvent): void {
    if (event.target === this.dialog()?.nativeElement) this.dismiss();
  }
}
