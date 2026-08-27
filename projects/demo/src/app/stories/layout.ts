import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrapFooter, ScrapHeader, type ScrapNavLink } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapHeader, ScrapFooter],
  template: `
    <story-page
      title="Layout"
      lead="Header et footer communs. Seul le logo change d'un projet à l'autre : il est projeté."
    >
      <story-case
        name="Header"
        note="Sous 720 px, la navigation passe derrière un menu burger."
        [stack]="true"
      >
        <scrap-header appName="Atelier Démo" [links]="links" homeHref="#">
          <span logo class="fake-logo">SN</span>
        </scrap-header>
      </story-case>

      <story-case name="Footer" [stack]="true">
        <scrap-footer appName="Atelier Démo">
          <div>
            <h3>Atelier</h3>
            <p>12 rue de la Casse<br />Quelque part</p>
          </div>
          <div>
            <h3>Liens</h3>
            <p>Inventaire<br />Contact</p>
          </div>
        </scrap-footer>
      </story-case>
    </story-page>
  `,
  styles: `
    .fake-logo {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      background: var(--scrap-copper);
      color: var(--scrap-white);
      font-family: var(--scrap-font-display);
      font-weight: 900;
    }
    scrap-footer h3 {
      color: var(--scrap-white);
      font-size: var(--scrap-fs-small);
    }
    scrap-footer p {
      margin: 0;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-steel);
    }
  `,
})
export class LayoutStory {
  readonly links: ScrapNavLink[] = [
    { label: 'Inventaire', href: '#' },
    { label: 'Ateliers', href: '#' },
    { label: 'Contact', href: '#' },
  ];
}
