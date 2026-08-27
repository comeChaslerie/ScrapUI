import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ScrapButton, ScrapModal, ScrapToast, type ScrapTone } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

@Component({
  selector: 'story-overlays',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapButton, ScrapModal],
  template: `
    <story-page
      title="Modale et toasts"
      lead="La modale s'appuie sur le <dialog> natif : piège de focus, Échap et arrière-plan inerte fournis par le navigateur."
    >
      <story-case name="Modale">
        <button scrap-button (click)="open.set(true)">Ouvrir la modale</button>
        <scrap-modal [(open)]="open" title="Mettre à la casse ?">
          <p>Cette pièce sera retirée de l'inventaire. L'opération est définitive.</p>
          <div actions>
            <button scrap-button variant="ghost" (click)="open.set(false)">Annuler</button>
            <button scrap-button (click)="open.set(false)">Confirmer</button>
          </div>
        </scrap-modal>
      </story-case>

      <story-case
        name="Toasts"
        note="Quatre au maximum ; la pile se met en pause au survol et au focus."
      >
        @for (tone of tones; track tone) {
          <button scrap-button variant="secondary" (click)="notify(tone)">{{ tone }}</button>
        }
      </story-case>
    </story-page>
  `,
})
export class OverlaysStory {
  private readonly toast = inject(ScrapToast);
  readonly open = signal(false);
  readonly tones: ScrapTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];

  private readonly messages: Record<ScrapTone, string> = {
    neutral: 'Noté.',
    info: 'Pièce cataloguée',
    success: 'Enregistré',
    warning: 'Stock faible',
    danger: 'Soudure ratée',
  };

  notify(tone: ScrapTone): void {
    this.toast.show(this.messages[tone], tone);
  }
}
