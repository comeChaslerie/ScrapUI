import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ScrapButton,
  ScrapEmptyState,
  ScrapErrorPage,
  ScrapSpinner,
} from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';
import { StoryReplay } from '../story-replay';

@Component({
  selector: 'story-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StoryPage,
    StoryCase,
    StoryReplay,
    ScrapSpinner,
    ScrapEmptyState,
    ScrapErrorPage,
    ScrapButton,
  ],
  template: `
    <story-page
      title="États"
      lead="Chargement, vide, erreur — les trois écrans qu'on oublie toujours."
    >
      <story-case name="Chargement">
        <scrap-spinner />
        <scrap-spinner label="Chargement…" />
        <scrap-spinner [size]="48" label="Inventaire" />
      </story-case>

      <story-case name="État vide" [stack]="true">
        <scrap-empty-state message="Aucune pièce ne correspond à ce filtre.">
          <button scrap-button>Réinitialiser</button>
        </scrap-empty-state>
      </story-case>

      <story-case
        name="Page d'erreur"
        note="Le code arrive d'un coup de tampon — une animation d'entrée, donc jouée à l'insertion seulement."
        [stack]="true"
      >
        <story-replay label="Rejouer l'entrée">
          <ng-template>
            <scrap-error-page code="404">
              <a scrap-button href="#">Retour à l'atelier</a>
            </scrap-error-page>
          </ng-template>
        </story-replay>
      </story-case>
    </story-page>
  `,
})
export class FeedbackStory {}
