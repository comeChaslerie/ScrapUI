import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrapField, ScrapInput } from './field';

@Component({
  imports: [ScrapField, ScrapInput],
  template: `
    <scrap-field label="Email" [hint]="hint()" [error]="error()">
      <input scrapInput type="email" />
    </scrap-field>
  `,
})
class Host {
  readonly hint = signal<string | undefined>(undefined);
  readonly error = signal<string | undefined>(undefined);
}

describe('ScrapField', () => {
  let fixture: ComponentFixture<Host>;

  const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
  const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it("relie l'étiquette au contrôle projeté", () => {
    // C'est tout l'objet de la directive scrapInput : sans elle, le `for`
    // de l'étiquette ne désignerait aucun élément.
    expect(input().id).toBeTruthy();
    expect(label().getAttribute('for')).toBe(input().id);
  });

  it('applique la classe de style de la charte', () => {
    expect(input().classList.contains('scrap-input')).toBe(true);
  });

  it("n'annonce ni indice ni erreur par défaut", () => {
    expect(input().getAttribute('aria-describedby')).toBeNull();
    expect(input().getAttribute('aria-invalid')).toBeNull();
  });

  it("décrit le contrôle par l'indice", async () => {
    fixture.componentInstance.hint.set('Adresse professionnelle');
    await fixture.whenStable();
    const hint = fixture.nativeElement.querySelector('small');
    expect(input().getAttribute('aria-describedby')).toBe(hint.id);
    expect(hint.textContent.trim()).toBe('Adresse professionnelle');
  });

  it("signale l'erreur et marque le contrôle invalide", async () => {
    fixture.componentInstance.error.set('Format invalide');
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('small.error');
    expect(error.getAttribute('role')).toBe('alert');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toBe(error.id);
  });

  it('cumule indice et erreur dans aria-describedby', async () => {
    fixture.componentInstance.hint.set('Indice');
    fixture.componentInstance.error.set('Erreur');
    await fixture.whenStable();
    const ids = input().getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    const rendered = [...fixture.nativeElement.querySelectorAll('small')].map((e: Element) => e.id);
    expect(ids).toEqual(rendered);
  });
});

@Component({
  imports: [ScrapInput],
  template: `<input scrapInput id="mien" />`,
})
class Standalone {}

describe('ScrapInput hors scrap-field', () => {
  it('se contente de styler, sans écraser un id existant', async () => {
    const fixture = TestBed.createComponent(Standalone);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.classList.contains('scrap-input')).toBe(true);
    expect(input.id).toBe('mien');
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});
