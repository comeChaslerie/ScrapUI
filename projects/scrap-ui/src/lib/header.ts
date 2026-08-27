import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ScrapIcon } from './icon';
import { ScrapIdGenerator } from './id';

export interface ScrapNavLink {
  label: string;
  href: string;
}

/**
 * Header commun : bandeau sombre à bord déchiré.
 * Le logo est projeté (slot [logo]) — chaque projet fournit le sien.
 *
 * <scrap-header appName="Mon Projet" [links]="links">
 *   <img logo src="logo.svg" alt="" />
 * </scrap-header>
 */
@Component({
  selector: 'scrap-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrapIcon],
  template: `
    <header class="bar scrap-grain scrap-torn-bottom">
      <a class="brand" [href]="homeHref()">
        <ng-content select="[logo]" />
        <span class="name">{{ appName() }}</span>
      </a>

      <nav [id]="navId" [attr.aria-label]="appName()" [class.open]="menuOpen()">
        @for (link of links(); track link.href) {
          <a [href]="link.href" (click)="menuOpen.set(false)">{{ link.label }}</a>
        }
        <ng-content select="[actions]" />
      </nav>

      <button
        class="burger"
        type="button"
        (click)="menuOpen.set(!menuOpen())"
        [attr.aria-expanded]="menuOpen()"
        [attr.aria-controls]="navId"
        [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
      >
        <scrap-icon [name]="menuOpen() ? 'close' : 'menu'" [size]="24" />
      </button>
    </header>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--scrap-space-4);
      padding: var(--scrap-space-3) var(--scrap-space-4) calc(var(--scrap-space-3) + 14px);
      background: var(--scrap-bark);
      color: var(--scrap-white);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-2);
      text-decoration: none;
      color: inherit;
    }
    .brand ::ng-deep [logo] {
      height: 40px;
      width: auto;
      display: block;
    }
    .name {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 1.2rem;
      transform: rotate(-1deg);
    }
    nav {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-4);
    }
    nav a {
      color: var(--scrap-white);
      text-decoration: none;
      font-family: var(--scrap-font-display);
      font-weight: 700;
      text-transform: uppercase;
      font-size: var(--scrap-fs-small);
      letter-spacing: 0.08em;
      border-bottom: 2px solid transparent;
      transition:
        border-color var(--scrap-transition),
        color var(--scrap-transition);
    }
    nav a:hover {
      color: var(--scrap-copper);
      border-bottom-color: var(--scrap-copper);
    }
    .burger:focus-visible {
      outline: 3px dashed var(--scrap-copper);
      outline-offset: 2px;
    }
    .burger {
      display: none;
      background: none;
      border: none;
      color: var(--scrap-white);
      cursor: pointer;
      padding: var(--scrap-space-1);
    }
    @media (prefers-reduced-motion: reduce) {
      .name {
        transform: none;
      }
      nav a {
        transition: none;
      }
    }
    @media (max-width: 720px) {
      .burger {
        display: block;
      }
      nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 10;
        flex-direction: column;
        align-items: flex-start;
        padding: var(--scrap-space-4);
        background: var(--scrap-bark);
        border-bottom: var(--scrap-border-w) solid var(--scrap-copper);
      }
      nav.open {
        display: flex;
      }
      :host {
        position: relative;
        display: block;
      }
    }
  `,
})
export class ScrapHeader {
  readonly appName = input.required<string>();
  readonly links = input<ScrapNavLink[]>([]);
  /** Cible du bloc marque. Utile quand l'appli n'est pas servie à la racine. */
  readonly homeHref = input('/');

  protected readonly navId = inject(ScrapIdGenerator).next('scrap-nav');
  protected readonly menuOpen = signal(false);
}
