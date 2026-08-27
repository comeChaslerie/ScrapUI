import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrapIcon, type ScrapIconName } from './icon';

/**
 * État vide commun : « rien dans la casse ».
 * <scrap-empty-state message="Aucun résultat">
 *   <button scrap-button>Créer</button>
 * </scrap-empty-state>
 */
@Component({
  selector: 'scrap-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrapIcon],
  template: `
    <div class="box scrap-grain">
      <scrap-icon [name]="icon()" [size]="48" />
      <p class="title">{{ title() }}</p>
      @if (message()) {
        <p class="msg">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--scrap-space-2);
      text-align: center;
      padding: var(--scrap-space-6) var(--scrap-space-4);
      border: var(--scrap-border-w) dashed var(--scrap-border-soft);
      color: var(--scrap-ink-muted);
    }
    scrap-icon {
      color: var(--scrap-border-soft);
    }
    .title {
      margin: 0;
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--scrap-ink);
    }
    .msg {
      margin: 0;
      max-width: 40ch;
    }
  `,
})
export class ScrapEmptyState {
  readonly title = input('Rien dans la casse');
  readonly message = input<string>();
  readonly icon = input<ScrapIconName>('recycle');
}
