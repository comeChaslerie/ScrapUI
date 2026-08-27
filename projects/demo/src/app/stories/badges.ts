import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrapBadge, type ScrapTone } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-badges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapBadge],
  template: `
    <story-page title="Badges" lead="Tampon désaxé, décliné sur les cinq tonalités sémantiques.">
      <story-case name="Tonalités">
        @for (tone of tones; track tone) {
          <scrap-badge [tone]="tone">{{ tone }}</scrap-badge>
        }
      </story-case>

      <story-case name="Dans un texte">
        <p>
          Châssis <scrap-badge tone="success">récupérable</scrap-badge> — moteur
          <scrap-badge tone="warning">à vérifier</scrap-badge> — carte mère
          <scrap-badge tone="danger">HS</scrap-badge>
        </p>
      </story-case>
    </story-page>
  `,
})
export class BadgesStory {
  readonly tones: ScrapTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];
}
