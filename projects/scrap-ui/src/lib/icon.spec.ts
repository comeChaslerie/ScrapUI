import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SCRAP_ICON_NAMES, ScrapIcon } from './icon';
import { SCRAP_SPLAT_NAMES, ScrapSplat } from './splat';

describe('ScrapIcon', () => {
  let fixture: ComponentFixture<ScrapIcon>;

  const svg = () => fixture.nativeElement.querySelector('svg') as SVGSVGElement;
  const path = () => fixture.nativeElement.querySelector('path') as SVGPathElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapIcon);
    fixture.componentRef.setInput('name', 'gear');
    await fixture.whenStable();
  });

  it('rend un tracé pour chaque icône du set', async () => {
    for (const name of SCRAP_ICON_NAMES) {
      fixture.componentRef.setInput('name', name);
      await fixture.whenStable();
      expect(path().getAttribute('d')?.length, name).toBeGreaterThan(10);
    }
  });

  it('hérite de la couleur du texte', () => {
    expect(svg().getAttribute('fill')).toBe('currentColor');
  });

  it('applique la taille sur les deux dimensions', async () => {
    fixture.componentRef.setInput('size', 32);
    await fixture.whenStable();
    expect(svg().getAttribute('width')).toBe('32');
    expect(svg().getAttribute('height')).toBe('32');
  });

  it('est décorative par défaut', () => {
    expect(svg().getAttribute('aria-hidden')).toBe('true');
    expect(svg().getAttribute('role')).toBeNull();
  });

  it("devient une image annoncée dès qu'on lui donne une étiquette", async () => {
    fixture.componentRef.setInput('label', 'Réglages');
    await fixture.whenStable();
    expect(svg().getAttribute('role')).toBe('img');
    expect(svg().getAttribute('aria-label')).toBe('Réglages');
    expect(svg().getAttribute('aria-hidden')).toBeNull();
  });
});

describe('ScrapSplat', () => {
  let fixture: ComponentFixture<ScrapSplat>;

  const path = () => fixture.nativeElement.querySelector('path') as SVGPathElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapSplat);
    await fixture.whenStable();
  });

  it('rend un tracé pour chaque éclaboussure', async () => {
    for (const name of SCRAP_SPLAT_NAMES) {
      fixture.componentRef.setInput('name', name);
      await fixture.whenStable();
      expect(path().getAttribute('d')?.length, name).toBeGreaterThan(10);
    }
  });

  it('utilise burst par défaut', () => {
    expect(fixture.componentInstance.name()).toBe('burst');
    expect(path().getAttribute('d')).toContain('M50 8');
  });

  it('pivote selon rotate', async () => {
    fixture.componentRef.setInput('rotate', 12);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    expect(svg.style.transform).toBe('rotate(12deg)');
  });

  it('reste décorative', () => {
    expect(
      (fixture.nativeElement.querySelector('svg') as SVGSVGElement).getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
