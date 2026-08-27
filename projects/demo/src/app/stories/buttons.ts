import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrapButton, ScrapIcon } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapButton, ScrapIcon],
  template: `
    <story-page title="Boutons" lead="Bloc massif, ombre portée dure, enfoncement au clic.">
      <story-case name="Variantes">
        <button scrap-button>Primaire</button>
        <button scrap-button variant="secondary">Secondaire</button>
        <button scrap-button variant="ghost">Fantôme</button>
      </story-case>

      <story-case name="Avec icône">
        <button scrap-button><scrap-icon name="bolt" [size]="16" /> Démarrer</button>
        <button scrap-button variant="secondary">
          Suivant <scrap-icon name="arrow" [size]="16" />
        </button>
      </story-case>

      <story-case name="Désactivé" note="L'attribut natif suffit : pas d'entrée dédiée.">
        <button scrap-button disabled>Indisponible</button>
        <button scrap-button variant="secondary" disabled>Indisponible</button>
      </story-case>

      <story-case name="Lien" note="Le sélecteur accepte aussi les ancres.">
        <a scrap-button href="#">Ancre stylée en bouton</a>
      </story-case>
    </story-page>
  `,
})
export class ButtonsStory {}
