import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScrapButton, ScrapField, ScrapInput, ScrapSlider } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StoryPage,
    StoryCase,
    ScrapField,
    ScrapInput,
    ScrapButton,
    ScrapSlider,
    ReactiveFormsModule,
  ],
  template: `
    <story-page
      title="Formulaires"
      lead="Champs, contrôles natifs stylés, et intégration aux formulaires réactifs."
    >
      <story-case name="Champ + indice" [stack]="true">
        <scrap-field label="Email" hint="Adresse professionnelle de préférence">
          <input scrapInput type="email" placeholder="prenom@atelier.fr" />
        </scrap-field>
      </story-case>

      <story-case
        name="Champ en erreur"
        note="Le message est annoncé (role=alert) et le contrôle passe en aria-invalid."
        [stack]="true"
      >
        <scrap-field label="Référence" error="Format attendu : XX-000">
          <input scrapInput type="text" value="chassis" />
        </scrap-field>
      </story-case>

      <story-case name="Zone de texte et liste" [stack]="true">
        <scrap-field label="Notes d'atelier">
          <textarea scrapInput rows="3">Traverse arrière à ressouder.</textarea>
        </scrap-field>
        <scrap-field label="État">
          <select class="scrap-select">
            <option>Récupérable</option>
            <option>Fonctionnel</option>
            <option>Pour pièces</option>
          </select>
        </scrap-field>
      </story-case>

      <story-case name="Cases et boutons radio" [stack]="true">
        <label class="scrap-choice">
          <input class="scrap-checkbox" type="checkbox" checked />
          Pièce inventoriée
        </label>
        <label class="scrap-choice">
          <input class="scrap-checkbox" type="checkbox" />
          Prête à l'expédition
        </label>
        <div>
          <label class="scrap-choice">
            <input class="scrap-radio" type="radio" name="tri" checked /> Par référence
          </label>
          <label class="scrap-choice">
            <input class="scrap-radio" type="radio" name="tri" /> Par état
          </label>
        </div>
      </story-case>

      <story-case
        name="Formulaire réactif"
        note="scrap-slider implémente ControlValueAccessor : formControlName fonctionne directement."
        [stack]="true"
      >
        <form [formGroup]="form">
          <scrap-field label="Nom de la pièce">
            <input scrapInput type="text" formControlName="nom" />
          </scrap-field>
          <p class="row">
            <span>Seuil d'alerte</span>
            <scrap-slider formControlName="seuil" label="Seuil d'alerte" />
          </p>
          <p class="row">
            <span>Verrouillé</span>
            <scrap-slider formControlName="verrouille" label="Réglage verrouillé" />
          </p>
          <button scrap-button type="button" (click)="dump()">Lire la valeur</button>
        </form>
        @if (dumped()) {
          <pre>{{ dumped() }}</pre>
        }
      </story-case>
    </story-page>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: var(--scrap-space-3);
      width: 100%;
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-4);
      margin: 0;
    }
    .row > span {
      min-width: 10rem;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-muted);
    }
    pre {
      font-size: var(--scrap-fs-small);
      background: var(--scrap-bg-alt);
      padding: var(--scrap-space-3);
      overflow-x: auto;
    }
  `,
})
export class FormsStory {
  readonly form = new FormGroup({
    nom: new FormControl('Moteur pas-à-pas'),
    seuil: new FormControl(35),
    verrouille: new FormControl({ value: 80, disabled: true }),
  });

  readonly dumped = signal('');

  dump(): void {
    this.dumped.set(JSON.stringify(this.form.getRawValue(), null, 2));
  }
}
