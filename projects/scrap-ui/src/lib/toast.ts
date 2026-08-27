import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ScrapIcon } from './icon';
import type { ScrapTone } from './badge';

export interface ScrapToastItem {
  id: number;
  message: string;
  tone: ScrapTone;
}

/** Au-delà, les plus anciens sont retirés : une pile de 20 toasts ne sert personne. */
const MAX_VISIBLE = 4;

/**
 * Service de notifications. Injecter et appeler :
 *
 * ```ts
 * inject(ScrapToast).show('Enregistré', 'success');
 * ```
 *
 * Nécessite un `<scrap-toasts />` dans le layout racine.
 */
@Injectable({ providedIn: 'root' })
export class ScrapToast {
  private readonly state = signal<ScrapToastItem[]>([]);
  readonly items = this.state.asReadonly();

  private nextId = 0;

  /**
   * Minuteries en cours, par identifiant de toast. `handle` est `null`
   * lorsque la pile est en pause : la minuterie existe encore, elle ne
   * court simplement pas.
   */
  private readonly timers = new Map<
    number,
    { handle: ReturnType<typeof setTimeout> | null; expiresAt: number; remaining: number }
  >();

  /**
   * Profondeur de pause. Le pointeur et le focus peuvent se superposer
   * (on survole un toast puis on clique dessus) : un simple booléen ferait
   * reprendre les minuteries au premier `focusout`, alors que le pointeur
   * est toujours sur la pile.
   */
  private pauseDepth = 0;

  constructor() {
    // Sans ça, une minuterie en vol garde une référence sur le service après
    // destruction de l'application (tests, SSR, micro-frontends).
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  show(message: string, tone: ScrapTone = 'info', durationMs = 3500): number {
    const item: ScrapToastItem = { id: this.nextId++, message, tone };
    this.state.update((list) => [...list, item].slice(-MAX_VISIBLE));

    // Le `slice` a pu évincer des toasts : leurs minuteries n'ont plus d'objet.
    for (const id of [...this.timers.keys()]) {
      if (!this.state().some((t) => t.id === id)) this.stopTimer(id);
    }

    if (durationMs > 0) this.startTimer(item.id, durationMs);
    return item.id;
  }

  close(id: number): void {
    this.stopTimer(id);
    this.state.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    for (const id of [...this.timers.keys()]) this.stopTimer(id);
    this.state.set([]);
  }

  /** Suspend toutes les minuteries — appelé quand le pointeur ou le focus entre dans la pile. */
  pause(): void {
    // Déjà en pause : recalculer le temps restant à partir d'une échéance
    // dépassée le ferait tomber à zéro, et le toast s'évaporerait à la reprise.
    if (this.pauseDepth++ > 0) return;

    const now = Date.now();
    for (const timer of this.timers.values()) {
      if (timer.handle === null) continue;
      clearTimeout(timer.handle);
      timer.handle = null;
      timer.remaining = Math.max(0, timer.expiresAt - now);
    }
  }

  /** Reprend les minuteries suspendues, chacune sur son temps restant. */
  resume(): void {
    if (this.pauseDepth === 0) return;
    if (--this.pauseDepth > 0) return;

    for (const [id, timer] of [...this.timers]) {
      if (timer.handle === null) this.startTimer(id, timer.remaining);
    }
  }

  private startTimer(id: number, durationMs: number): void {
    const existing = this.timers.get(id);
    if (existing?.handle) clearTimeout(existing.handle);

    // Un toast qui apparaît pendant que la pile est en pause attend son tour :
    // il serait absurde qu'il s'efface sous le pointeur de l'utilisateur.
    const paused = this.pauseDepth > 0;
    this.timers.set(id, {
      handle: paused ? null : setTimeout(() => this.close(id), durationMs),
      expiresAt: Date.now() + durationMs,
      remaining: durationMs,
    });
  }

  private stopTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    this.timers.delete(id);
  }
}

/**
 * Zone d'affichage des toasts — tampons qui claquent en bas à droite.
 *
 * Deux régions live distinctes : les messages `danger` sont annoncés en
 * `assertive`, les autres en `polite`. Imbriquer une seule région et y
 * changer le rôle ferait annoncer deux fois par certains lecteurs d'écran.
 */
@Component({
  selector: 'scrap-toasts',
  imports: [ScrapIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'svc.pause()',
    '(mouseleave)': 'svc.resume()',
    '(focusin)': 'svc.pause()',
    '(focusout)': 'svc.resume()',
  },
  template: `
    <div class="region" role="alert" aria-live="assertive">
      @for (t of urgent(); track t.id) {
        <div class="toast" [class]="t.tone">
          <span>{{ t.message }}</span>
          <button type="button" aria-label="Fermer" (click)="svc.close(t.id)">
            <scrap-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
    <div class="region" role="status" aria-live="polite">
      @for (t of routine(); track t.id) {
        <div class="toast" [class]="t.tone">
          <span>{{ t.message }}</span>
          <button type="button" aria-label="Fermer" (click)="svc.close(t.id)">
            <scrap-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      right: var(--scrap-space-4);
      bottom: var(--scrap-space-4);
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--scrap-space-2);
      pointer-events: none;
    }
    .region {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--scrap-space-2);
    }
    .region:empty {
      display: none;
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: var(--scrap-space-3);
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: var(--scrap-fs-small);
      padding: 0.7em 1.2em;
      border: var(--scrap-border-w) solid var(--scrap-border);
      background: var(--scrap-surface);
      color: var(--scrap-ink-strong);
      box-shadow: var(--scrap-shadow);
      rotate: -1.5deg;
      animation: scrap-stamp-in 320ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
    }
    .toast button {
      display: inline-flex;
      padding: 0;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.6;
    }
    .toast button:hover {
      opacity: 1;
    }
    .toast button:focus-visible {
      outline: 2px dashed currentColor;
      outline-offset: 2px;
      opacity: 1;
    }
    .toast.info {
      border-color: var(--scrap-info);
      color: var(--scrap-info);
    }
    .toast.success {
      border-color: var(--scrap-success);
      color: var(--scrap-success);
    }
    .toast.warning {
      border-color: var(--scrap-warning);
      color: var(--scrap-warning);
    }
    .toast.danger {
      border-color: var(--scrap-danger);
      color: var(--scrap-danger);
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        rotate: none;
        animation: none;
      }
    }
  `,
})
export class ScrapToasts {
  protected readonly svc = inject(ScrapToast);
  protected readonly urgent = computed(() => this.svc.items().filter((t) => t.tone === 'danger'));
  protected readonly routine = computed(() => this.svc.items().filter((t) => t.tone !== 'danger'));
}
