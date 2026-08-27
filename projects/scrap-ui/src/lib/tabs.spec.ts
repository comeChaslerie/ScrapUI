import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrapTab, ScrapTabs } from './tabs';

@Component({
  imports: [ScrapTabs, ScrapTab],
  template: `
    <scrap-tabs label="Fiche">
      @for (t of labels(); track t) {
        <scrap-tab [label]="t">contenu {{ t }}</scrap-tab>
      }
    </scrap-tabs>
  `,
})
class Host {
  readonly labels = signal(['A', 'B', 'C']);
}

describe('ScrapTabs', () => {
  let fixture: ComponentFixture<Host>;

  const buttons = () =>
    [...fixture.nativeElement.querySelectorAll('button[role="tab"]')] as HTMLButtonElement[];
  const panels = () => [...fixture.nativeElement.querySelectorAll('scrap-tab')] as HTMLElement[];

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('rend un onglet par scrap-tab projeté', () => {
    expect(buttons().map((b) => b.textContent?.trim())).toEqual(['A', 'B', 'C']);
  });

  it('active le premier onglet par défaut', () => {
    expect(buttons()[0].getAttribute('aria-selected')).toBe('true');
    expect(panels()[0].hasAttribute('hidden')).toBe(false);
    expect(panels()[1].hasAttribute('hidden')).toBe(true);
  });

  it('change de panneau au clic', async () => {
    buttons()[2].click();
    await fixture.whenStable();
    expect(buttons()[2].getAttribute('aria-selected')).toBe('true');
    expect(panels()[2].hasAttribute('hidden')).toBe(false);
    expect(panels()[0].hasAttribute('hidden')).toBe(true);
  });

  it('lie chaque onglet à son panneau', () => {
    for (const [i, button] of buttons().entries()) {
      const panelId = button.getAttribute('aria-controls');
      expect(panelId).toBe(panels()[i].id);
      expect(panels()[i].getAttribute('aria-labelledby')).toBe(button.id);
      expect(panels()[i].getAttribute('role')).toBe('tabpanel');
    }
  });

  it("étiquette la barre pour les lecteurs d'écran", () => {
    const rail = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(rail.getAttribute('aria-label')).toBe('Fiche');
  });

  it('applique un tabindex mobile', async () => {
    expect(buttons().map((b) => b.tabIndex)).toEqual([0, -1, -1]);
    buttons()[1].click();
    await fixture.whenStable();
    expect(buttons().map((b) => b.tabIndex)).toEqual([-1, 0, -1]);
  });

  describe('navigation clavier', () => {
    const press = async (key: string) => {
      fixture.nativeElement
        .querySelector('[role="tablist"]')
        .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await fixture.whenStable();
    };
    const selected = () => buttons().findIndex((b) => b.getAttribute('aria-selected') === 'true');

    it('avance et recule avec les flèches', async () => {
      await press('ArrowRight');
      expect(selected()).toBe(1);
      await press('ArrowLeft');
      expect(selected()).toBe(0);
    });

    it('boucle aux deux extrémités', async () => {
      await press('ArrowLeft');
      expect(selected()).toBe(2);
      await press('ArrowRight');
      expect(selected()).toBe(0);
    });

    it('saute au premier et au dernier avec Origine et Fin', async () => {
      await press('End');
      expect(selected()).toBe(2);
      await press('Home');
      expect(selected()).toBe(0);
    });

    it('ignore les autres touches', async () => {
      await press('a');
      expect(selected()).toBe(0);
    });
  });

  it('reborne la sélection quand la liste rétrécit', async () => {
    buttons()[2].click();
    await fixture.whenStable();
    expect(panels()[2].hasAttribute('hidden')).toBe(false);

    // L'index demandé (2) n'existe plus : sans bornage on afficherait
    // un panneau fantôme, ou aucun.
    fixture.componentInstance.labels.set(['A', 'B']);
    await fixture.whenStable();
    expect(buttons()).toHaveLength(2);
    expect(buttons()[1].getAttribute('aria-selected')).toBe('true');
  });
});
