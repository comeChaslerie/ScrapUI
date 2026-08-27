import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrapCard } from './card';
import { ScrapEmptyState } from './empty-state';
import { ScrapErrorPage } from './error-page';
import { ScrapFooter } from './footer';
import { ScrapSpinner } from './spinner';

describe('ScrapCard', () => {
  let fixture: ComponentFixture<ScrapCard>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapCard);
    await fixture.whenStable();
  });

  it("n'affiche pas d'en-tête sans titre", () => {
    expect(fixture.nativeElement.querySelector('.card-head')).toBeNull();
  });

  it("affiche l'en-tête riveté dès qu'un titre est fourni", async () => {
    fixture.componentRef.setInput('title', 'CH-042');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.card-head h3').textContent.trim()).toBe('CH-042');
    expect(fixture.nativeElement.querySelectorAll('.rivet')).toHaveLength(2);
  });
});

describe('ScrapSpinner', () => {
  let fixture: ComponentFixture<ScrapSpinner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapSpinner);
    await fixture.whenStable();
  });

  it('rend un engrenage sans libellé par défaut', () => {
    expect(fixture.nativeElement.querySelector('scrap-icon')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('affiche le libellé quand il est fourni', async () => {
    fixture.componentRef.setInput('label', 'Chargement…');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('span').textContent.trim()).toBe('Chargement…');
  });
});

describe('ScrapEmptyState', () => {
  let fixture: ComponentFixture<ScrapEmptyState>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapEmptyState);
    await fixture.whenStable();
  });

  it('propose un titre par défaut', () => {
    expect(fixture.nativeElement.querySelector('.title').textContent.trim()).toBe(
      'Rien dans la casse',
    );
  });

  it("affiche le message secondaire seulement s'il existe", async () => {
    expect(fixture.nativeElement.querySelector('.msg')).toBeNull();
    fixture.componentRef.setInput('message', 'Aucun résultat');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.msg').textContent.trim()).toBe('Aucun résultat');
  });

  it('accepte une autre icône du set', async () => {
    fixture.componentRef.setInput('icon', 'bolt');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('path')).not.toBeNull();
  });
});

describe('ScrapErrorPage', () => {
  let fixture: ComponentFixture<ScrapErrorPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScrapErrorPage);
    await fixture.whenStable();
  });

  it('affiche 404 et son message par défaut', () => {
    expect(fixture.nativeElement.querySelector('.code').textContent.trim()).toBe('404');
    expect(fixture.nativeElement.querySelector('.msg').textContent.trim()).toContain('casse');
  });

  it('accepte un autre code et un autre message', async () => {
    fixture.componentRef.setInput('code', '500');
    fixture.componentRef.setInput('message', 'La presse a lâché.');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.code').textContent.trim()).toBe('500');
    expect(fixture.nativeElement.querySelector('.msg').textContent.trim()).toBe(
      'La presse a lâché.',
    );
  });
});

describe('ScrapFooter', () => {
  it("affiche l'année courante et le nom du projet", async () => {
    const fixture = TestBed.createComponent(ScrapFooter);
    fixture.componentRef.setInput('appName', 'Atelier');
    await fixture.whenStable();
    const legal = fixture.nativeElement.querySelector('.legal').textContent as string;
    expect(legal).toContain(String(new Date().getFullYear()));
    expect(legal).toContain('Atelier');
  });
});
