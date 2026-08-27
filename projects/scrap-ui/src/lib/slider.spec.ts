import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrapSlider } from './slider';

function range(fixture: ComponentFixture<unknown>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input[type="range"]');
}

describe('ScrapSlider', () => {
  let fixture: ComponentFixture<ScrapSlider>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapSlider);
    await fixture.whenStable();
  });

  it('reporte min, max et step sur le contrôle natif', async () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 20);
    fixture.componentRef.setInput('step', 2);
    await fixture.whenStable();

    const input = range(fixture);
    expect(input.min).toBe('10');
    expect(input.max).toBe('20');
    expect(input.step).toBe('2');
  });

  it('remonte la saisie utilisateur dans la valeur', async () => {
    const input = range(fixture);
    input.value = '42';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(42);
  });

  it('borne le remplissage entre 0 et 1', async () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 50);
    fixture.componentInstance.value.set(200);
    await fixture.whenStable();
    expect(range(fixture).style.getPropertyValue('--fill')).toBe('1');

    fixture.componentInstance.value.set(-10);
    await fixture.whenStable();
    expect(range(fixture).style.getPropertyValue('--fill')).toBe('0');
  });

  it('ne divise pas par zéro quand min vaut max', async () => {
    fixture.componentRef.setInput('min', 5);
    fixture.componentRef.setInput('max', 5);
    await fixture.whenStable();
    expect(range(fixture).style.getPropertyValue('--fill')).toBe('0');
  });

  it('affiche les bornes, et sait les masquer', async () => {
    fixture.componentRef.setInput('min', 3);
    fixture.componentRef.setInput('max', 9);
    await fixture.whenStable();
    expect(
      [...fixture.nativeElement.querySelectorAll('.bound')].map((e: Element) =>
        e.textContent?.trim(),
      ),
    ).toEqual(['3', '9']);

    fixture.componentRef.setInput('showBounds', false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.bound')).toHaveLength(0);
  });

  it('déduit le nombre de crans du pas quand il reste raisonnable', async () => {
    fixture.componentRef.setInput('ticks', true);
    fixture.componentRef.setInput('step', 10);
    await fixture.whenStable();
    // 100 / 10 = 10 intervalles, donc 11 crans.
    expect(fixture.nativeElement.querySelectorAll('.tick')).toHaveLength(11);
  });

  it('retombe sur 10 intervalles quand le pas en produirait trop', async () => {
    fixture.componentRef.setInput('ticks', true);
    fixture.componentRef.setInput('step', 1);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.tick')).toHaveLength(11);
  });

  it('marque les crans déjà franchis', async () => {
    fixture.componentRef.setInput('ticks', true);
    fixture.componentRef.setInput('step', 25);
    fixture.componentInstance.value.set(50);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.tick.on')).toHaveLength(3);
  });

  it('désactive le contrôle et vide le remplissage', async () => {
    fixture.componentInstance.value.set(80);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(range(fixture).disabled).toBe(true);
    expect(range(fixture).style.getPropertyValue('--fill')).toBe('0');
    expect(fixture.nativeElement.classList.contains('disabled')).toBe(true);
  });

  it("expose l'étiquette accessible", async () => {
    fixture.componentRef.setInput('label', 'Volume');
    await fixture.whenStable();
    expect(range(fixture).getAttribute('aria-label')).toBe('Volume');
  });
});

@Component({
  imports: [ScrapSlider, ReactiveFormsModule],
  template: `<scrap-slider [formControl]="control" />`,
})
class HostForm {
  readonly control = new FormControl(30);
}

describe('ScrapSlider — formulaires réactifs', () => {
  let fixture: ComponentFixture<HostForm>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostForm);
    await fixture.whenStable();
  });

  it('affiche la valeur initiale du contrôle', () => {
    expect(range(fixture).value).toBe('30');
  });

  it('propage la saisie vers le FormControl', async () => {
    const input = range(fixture);
    input.value = '75';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe(75);
  });

  it('marque le contrôle comme touché au blur', async () => {
    expect(fixture.componentInstance.control.touched).toBe(false);
    range(fixture).dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('suit disable() / enable() du FormControl', async () => {
    fixture.componentInstance.control.disable();
    await fixture.whenStable();
    expect(range(fixture).disabled).toBe(true);

    fixture.componentInstance.control.enable();
    await fixture.whenStable();
    expect(range(fixture).disabled).toBe(false);
  });

  it('traite une valeur nulle comme zéro', async () => {
    fixture.componentInstance.control.setValue(null);
    await fixture.whenStable();
    expect(range(fixture).value).toBe('0');
  });
});
