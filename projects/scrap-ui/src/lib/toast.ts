import { Component, Injectable, inject, signal } from '@angular/core';
import type { ScrapTone } from './badge';

export interface ScrapToastItem {
  id: number;
  message: string;
  tone: ScrapTone;
}

let nextToastId = 0;

/**
 * Service de notifications. Injecter et appeler :
 *   toast.show('Enregistré', 'success')
 * Nécessite un <scrap-toasts /> dans le layout racine.
 */
@Injectable({ providedIn: 'root' })
export class ScrapToast {
  readonly items = signal<ScrapToastItem[]>([]);

  show(message: string, tone: ScrapTone = 'info', durationMs = 3500): void {
    const item: ScrapToastItem = { id: nextToastId++, message, tone };
    this.items.update((list) => [...list, item]);
    setTimeout(() => this.close(item.id), durationMs);
  }

  close(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}

/** Zone d'affichage des toasts — tampons qui claquent en bas à droite. */
@Component({
  selector: 'scrap-toasts',
  template: `
    @for (t of svc.items(); track t.id) {
      <div class="toast scrap-stamp-in" [class]="t.tone" role="status" (click)="svc.close(t.id)">
        {{ t.message }}
      </div>
    }
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
    .toast {
      pointer-events: auto;
      cursor: pointer;
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
    }
    .toast.info    { border-color: var(--scrap-info);    color: var(--scrap-info); }
    .toast.success { border-color: var(--scrap-success); color: var(--scrap-success); }
    .toast.warning { border-color: var(--scrap-warning); color: var(--scrap-warning); }
    .toast.danger  { border-color: var(--scrap-danger);  color: var(--scrap-danger); }
  `,
})
export class ScrapToasts {
  protected readonly svc = inject(ScrapToast);
}
