import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Footer commun : plaque sombre, contenu projeté libre,
 * mention automatique © année + nom du projet.
 */
@Component({
  selector: 'scrap-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="scrap-grain">
      <div class="content">
        <ng-content />
      </div>
      <p class="legal">© {{ year }} {{ appName() }} — assemblé à la main, comme le reste.</p>
    </footer>
  `,
  styles: `
    footer {
      background: var(--scrap-bark);
      color: var(--scrap-white);
      padding: var(--scrap-space-5) var(--scrap-space-4) var(--scrap-space-3);
      border-top: 4px solid var(--scrap-copper);
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--scrap-space-5);
    }
    .legal {
      margin: var(--scrap-space-4) 0 0;
      font-size: 0.8rem;
      color: var(--scrap-steel);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  `,
})
export class ScrapFooter {
  readonly appName = input.required<string>();
  protected readonly year = new Date().getFullYear();
}
