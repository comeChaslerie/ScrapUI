import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrapButton, type ScrapButtonVariant } from './button';
import { ScrapBadge, type ScrapTone } from './badge';

@Component({
  imports: [ScrapButton],
  template: `<button scrap-button class="a-moi" [variant]="variant()">Go</button>`,
})
class ButtonHost {
  readonly variant = signal<ScrapButtonVariant>('primary');
}

describe('ScrapButton', () => {
  it('applique la classe de variante', async () => {
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList.contains('scrap-btn--primary')).toBe(true);

    fixture.componentInstance.variant.set('ghost');
    await fixture.whenStable();
    expect(button.classList.contains('scrap-btn--ghost')).toBe(true);
    expect(button.classList.contains('scrap-btn--primary')).toBe(false);
  });

  it('conserve les classes posées par le consommateur', async () => {
    // Un binding `[class]` global les écraserait — d'où les bindings unitaires.
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('a-moi')).toBe(true);
    expect(button.classList.contains('scrap-btn')).toBe(true);
  });
});

@Component({
  imports: [ScrapBadge],
  template: `<scrap-badge class="a-moi" [tone]="tone()">OK</scrap-badge>`,
})
class BadgeHost {
  readonly tone = signal<ScrapTone>('neutral');
}

describe('ScrapBadge', () => {
  it("n'ajoute pas de classe pour la tonalité neutre", async () => {
    const fixture = TestBed.createComponent(BadgeHost);
    await fixture.whenStable();
    const badge = fixture.nativeElement.querySelector('scrap-badge') as HTMLElement;
    for (const tone of ['info', 'success', 'warning', 'danger']) {
      expect(badge.classList.contains(tone)).toBe(false);
    }
  });

  it('applique une classe par tonalité sémantique', async () => {
    const fixture = TestBed.createComponent(BadgeHost);
    await fixture.whenStable();
    const badge = fixture.nativeElement.querySelector('scrap-badge') as HTMLElement;

    for (const tone of ['info', 'success', 'warning', 'danger'] as ScrapTone[]) {
      fixture.componentInstance.tone.set(tone);
      await fixture.whenStable();
      expect(badge.classList.contains(tone), tone).toBe(true);
    }
  });

  it('conserve les classes du consommateur', async () => {
    const fixture = TestBed.createComponent(BadgeHost);
    await fixture.whenStable();
    const badge = fixture.nativeElement.querySelector('scrap-badge') as HTMLElement;
    expect(badge.classList.contains('a-moi')).toBe(true);
  });
});
