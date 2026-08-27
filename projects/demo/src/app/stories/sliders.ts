import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ScrapIcon, ScrapSlider, type ScrapIconName } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-sliders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapSlider, ScrapIcon],
  template: `
    <story-page
      title="Curseurs"
      lead="Piste remplie côté cuivre, poignée en rivet, crans optionnels."
    >
      <story-case name="Avec icône de volume" [stack]="true">
        @for (v of volumes; track v.label) {
          <scrap-slider [(value)]="v.value" [label]="v.label">
            <scrap-icon icon [name]="iconFor(v.value())" />
          </scrap-slider>
        }
      </story-case>

      <story-case
        name="Crans"
        note="ticks suit le step tant qu'il reste sous 20 crans."
        [stack]="true"
      >
        <scrap-slider [(value)]="stepped" [step]="10" [ticks]="true" label="Réglage par crans" />
        <scrap-slider [(value)]="fine" [step]="1" [ticks]="true" label="Réglage fin" />
      </story-case>

      <story-case name="Sans bornes / désactivé" [stack]="true">
        <scrap-slider [(value)]="bare" [showBounds]="false" label="Sans bornes" />
        <scrap-slider [(value)]="locked" [disabled]="true" label="Verrouillé" />
      </story-case>

      <story-case name="Échelle personnalisée" [stack]="true">
        <scrap-slider
          [(value)]="temperature"
          [min]="-20"
          [max]="60"
          [step]="5"
          [ticks]="true"
          label="Température"
        />
      </story-case>
    </story-page>
  `,
})
export class SlidersStory {
  readonly volumes = [
    { label: 'Volume maximal', value: signal(100) },
    { label: 'Volume moyen', value: signal(58) },
    { label: 'Volume coupé', value: signal(0) },
  ];

  readonly stepped = signal(70);
  readonly fine = signal(42);
  readonly bare = signal(25);
  readonly locked = signal(65);
  readonly temperature = signal(20);

  iconFor(v: number): ScrapIconName {
    return v === 0 ? 'mute' : v < 50 ? 'volume-low' : 'volume';
  }
}
