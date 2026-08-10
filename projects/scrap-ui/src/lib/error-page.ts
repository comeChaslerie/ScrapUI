import { Component, input } from '@angular/core';
import { ScrapSplat } from './splat';

/**
 * Page d'erreur prête à l'emploi (404, 500…).
 * <scrap-error-page code="404" message="Cette pièce n'est pas dans la casse.">
 *   <a scrap-button href="/">Retour à l'atelier</a>
 * </scrap-error-page>
 */
@Component({
  selector: 'scrap-error-page',
  imports: [ScrapSplat],
  template: `
    <div class="wrap scrap-grain">
      <scrap-splat class="deco" name="burst" [size]="220" [rotate]="12" />
      <p class="code scrap-stamp-in">{{ code() }}</p>
      <p class="msg">{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styles: `
    .wrap {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--scrap-space-3);
      text-align: center;
      padding: var(--scrap-space-6) var(--scrap-space-4);
    }
    .deco {
      position: absolute;
      color: var(--scrap-copper);
      opacity: 0.16;
    }
    .wrap { position: relative; overflow: hidden; }
    .code {
      margin: 0;
      font-family: var(--scrap-font-display);
      font-weight: 900;
      font-size: clamp(5rem, 18vw, 11rem);
      line-height: 1;
      color: var(--scrap-ink-strong);
      rotate: -2deg;
      position: relative;
    }
    .msg {
      margin: 0;
      font-size: 1.1rem;
      color: var(--scrap-ink-muted);
      max-width: 44ch;
      position: relative;
    }
  `,
})
export class ScrapErrorPage {
  readonly code = input('404');
  readonly message = input("Cette pièce n'est pas dans la casse.");
}
