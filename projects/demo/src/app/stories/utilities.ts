import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoryCase, StoryPage } from '../story-page';
import { StoryReplay } from '../story-replay';

@Component({
  selector: 'story-utilities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, StoryReplay],
  template: `
    <story-page
      title="Utilitaires"
      lead="Classes globales du thème : textures, séparateurs, curseurs, animations."
    >
      <story-case name="Grain et bord déchiré" [stack]="true">
        <div class="demo-plate scrap-grain">.scrap-grain — bruit en surimpression</div>
        <div class="demo-plate scrap-torn-bottom">.scrap-torn-bottom — bord bas déchiré</div>
      </story-case>

      <story-case name="Tampon et séparateur" [stack]="true">
        <span class="scrap-stamp">.scrap-stamp</span>
        <hr class="scrap-rule" />
      </story-case>

      <story-case name="Tableau" [stack]="true">
        <table class="scrap-table">
          <thead>
            <tr>
              <th>Pièce</th>
              <th>Réf.</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            @for (row of stock; track row.ref) {
              <tr>
                <td>{{ row.piece }}</td>
                <td>{{ row.ref }}</td>
                <td>{{ row.etat }}</td>
              </tr>
            }
          </tbody>
        </table>
      </story-case>

      <story-case name="Curseurs" note="Survolez chaque plaque pour voir le curseur associé.">
        @for (c of cursors; track c.cls) {
          <div class="cursor-plate" [class]="c.cls">{{ c.label }}</div>
        }
      </story-case>

      <story-case
        name="Animations"
        note="Toutes neutralisées sous prefers-reduced-motion. Les animations d'entrée ne se déclenchent qu'à l'insertion de l'élément : le bouton les rejoue sans recharger la page."
        [stack]="true"
      >
        <story-replay>
          <ng-template>
            <div class="demo-plate scrap-stamp-in">
              .scrap-stamp-in — coup de tampon à l'apparition
            </div>
            <div class="demo-plate scrap-reveal">.scrap-reveal — apparition au défilement</div>
          </ng-template>
        </story-replay>
        <div class="demo-plate scrap-jitter">
          .scrap-jitter — tremblement au survol, rejoué à chaque passage
        </div>
      </story-case>
    </story-page>
  `,
  styles: `
    .demo-plate {
      padding: var(--scrap-space-4);
      background: var(--scrap-bg-alt);
      border: var(--scrap-border-w) solid var(--scrap-border);
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      font-size: var(--scrap-fs-small);
      letter-spacing: 0.06em;
      width: 100%;
    }
    .cursor-plate {
      display: grid;
      place-items: center;
      width: 11rem;
      height: 5rem;
      text-align: center;
      background: var(--scrap-bg-alt);
      border: var(--scrap-border-w) solid var(--scrap-border);
      font-size: var(--scrap-fs-small);
    }
    hr.scrap-rule {
      width: 100%;
    }
  `,
})
export class UtilitiesStory {
  readonly stock = [
    { piece: 'Châssis rouillé', ref: 'CH-042', etat: 'Récupérable' },
    { piece: 'Moteur pas-à-pas', ref: 'MO-118', etat: 'Fonctionnel' },
    { piece: 'Carte mère grillée', ref: 'CM-007', etat: 'Pour pièces' },
  ];

  readonly cursors = [
    { cls: 'scrap-cursor-cross', label: 'Croix de visée' },
    { cls: 'scrap-cursor-wrench', label: 'Clé à molette' },
    { cls: 'scrap-cursor-marker', label: 'Marqueur' },
    { cls: 'scrap-cursor-spray', label: 'Bombe de peinture' },
    { cls: 'scrap-cursor-gear', label: 'Engrenage' },
  ];
}
