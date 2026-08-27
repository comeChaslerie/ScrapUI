import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrapTab, ScrapTabs } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapTabs, ScrapTab],
  template: `
    <story-page
      title="Onglets"
      lead="Étiquettes de classeur métallique. Navigation clavier : flèches, Origine, Fin."
    >
      <story-case name="Trois onglets" [stack]="true">
        <scrap-tabs label="Fiche pièce">
          <scrap-tab label="Détails">
            <p>Châssis acier, 1,4 m, piqué de rouille sur la traverse arrière.</p>
          </scrap-tab>
          <scrap-tab label="Historique">
            <p>Entré le 12/01. Nettoyé le 03/02. Traité antirouille le 18/02.</p>
          </scrap-tab>
          <scrap-tab label="Notes">
            <p>Prévoir une ressoudure avant remise en circulation.</p>
          </scrap-tab>
        </scrap-tabs>
      </story-case>

      <story-case name="Onglet unique" [stack]="true">
        <scrap-tabs label="Résumé">
          <scrap-tab label="Résumé">
            <p>Un seul onglet : la barre reste, le contenu s'affiche.</p>
          </scrap-tab>
        </scrap-tabs>
      </story-case>
    </story-page>
  `,
})
export class TabsStory {}
