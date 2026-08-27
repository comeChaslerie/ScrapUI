import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SCRAP_ICON_NAMES,
  SCRAP_SPLAT_NAMES,
  ScrapIcon,
  ScrapSplat,
} from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-iconography',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapIcon, ScrapSplat],
  template: `
    <story-page
      title="Icônes et décors"
      lead="Tracés anguleux maison, en currentColor. Les noms sont typés : une faute de frappe ne compile pas."
    >
      <story-case name="Le set complet">
        @for (name of icons; track name) {
          <figure>
            <scrap-icon [name]="name" [size]="28" />
            <figcaption>{{ name }}</figcaption>
          </figure>
        }
      </story-case>

      <story-case name="Tailles">
        <scrap-icon name="gear" [size]="16" />
        <scrap-icon name="gear" [size]="24" />
        <scrap-icon name="gear" [size]="40" />
        <scrap-icon name="gear" [size]="64" />
      </story-case>

      <story-case name="Éclaboussures">
        @for (name of splats; track name) {
          <figure>
            <scrap-splat [name]="name" [size]="110" />
            <figcaption>{{ name }}</figcaption>
          </figure>
        }
      </story-case>
    </story-page>
  `,
  styles: `
    figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--scrap-space-2);
      min-width: 6rem;
      color: var(--scrap-accent);
    }
    figcaption {
      font-size: 0.75rem;
      color: var(--scrap-ink-muted);
    }
  `,
})
export class IconographyStory {
  readonly icons = SCRAP_ICON_NAMES;
  readonly splats = SCRAP_SPLAT_NAMES;
}
