import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ScrapIcon } from './icon';
import { ScrapTheme } from './theme';

/**
 * Bascule clair/sombre. L'état vit dans le service {@link ScrapTheme} :
 * plusieurs boutons dans la même page restent synchronisés.
 */
@Component({
  selector: 'scrap-theme-toggle',
  imports: [ScrapIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="theme.toggle()" [attr.aria-label]="label()">
      <scrap-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="18" />
    </button>
  `,
  styles: `
    button {
      display: inline-flex;
      padding: 0.5em;
      background: transparent;
      color: inherit;
      border: var(--scrap-border-w) solid currentColor;
      border-radius: var(--scrap-radius);
      cursor: pointer;
      transform: rotate(2deg);
      transition: transform var(--scrap-transition);
    }
    button:hover {
      transform: rotate(-2deg) scale(1.05);
    }
    button:focus-visible {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      button,
      button:hover {
        transform: none;
        transition: none;
      }
    }
  `,
})
export class ScrapThemeToggle {
  protected readonly theme = inject(ScrapTheme);
  protected readonly label = computed(
    () => `Passer en mode ${this.theme.theme() === 'dark' ? 'clair' : 'sombre'}`,
  );
}
