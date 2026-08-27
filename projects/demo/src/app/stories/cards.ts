import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrapButton, ScrapCard } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapCard, ScrapButton],
  template: `
    <story-page title="Cartes" lead="Plaque bordée, ombre dure, en-tête riveté optionnel.">
      <story-case name="Avec en-tête">
        <scrap-card title="Châssis CH-042" style="max-width: 22rem">
          <p>Acier, piqué de rouille sur la traverse arrière. Structure saine.</p>
          <button scrap-button>Inspecter</button>
        </scrap-card>
      </story-case>

      <story-case name="Sans en-tête">
        <scrap-card style="max-width: 22rem">
          <p>Une carte sans titre : la plaque nue, pour du contenu libre.</p>
        </scrap-card>
      </story-case>

      <story-case name="En grille">
        <div class="grid">
          @for (p of pieces; track p.ref) {
            <scrap-card [title]="p.ref">
              <p>{{ p.piece }}</p>
            </scrap-card>
          }
        </div>
      </story-case>
    </story-page>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
      gap: var(--scrap-space-4);
      width: 100%;
    }
  `,
})
export class CardsStory {
  readonly pieces = [
    { ref: 'CH-042', piece: 'Châssis rouillé' },
    { ref: 'MO-118', piece: 'Moteur pas-à-pas' },
    { ref: 'CM-007', piece: 'Carte mère grillée' },
  ];
}
