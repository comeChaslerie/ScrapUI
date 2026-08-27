import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrapIcon } from './icon';

/** Loader : engrenage qui tourne par à-coups, comme une vieille mécanique. */
@Component({
  selector: 'scrap-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrapIcon],
  template: `
    <scrap-icon name="gear" [size]="size()" />
    @if (label()) {
      <span>{{ label() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--scrap-space-2);
      color: var(--scrap-accent);
    }
    scrap-icon {
      animation: scrap-spin 1.4s steps(8) infinite;
    }
    span {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-muted);
    }
    @keyframes scrap-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      scrap-icon {
        animation-duration: 4s;
      }
    }
  `,
})
export class ScrapSpinner {
  readonly size = input(28);
  readonly label = input<string>();
}
