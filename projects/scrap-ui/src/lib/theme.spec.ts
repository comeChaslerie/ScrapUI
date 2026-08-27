import { TestBed } from '@angular/core/testing';
import { ScrapTheme } from './theme';
import { installFakeStorage, removeStorage } from '../testing/fake-storage';

describe('ScrapTheme', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = installFakeStorage();
    document.documentElement.removeAttribute('data-scrap-theme');
    TestBed.resetTestingModule();
  });

  it("retombe sur le thème clair quand rien n'est stocké", () => {
    // jsdom n'implémente pas matchMedia : l'appel optionnel doit passer
    // sans lever, exactement comme sur le serveur en SSR.
    const theme = TestBed.inject(ScrapTheme);
    expect(theme.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-scrap-theme')).toBe('light');
  });

  it('reprend le thème mémorisé', () => {
    storage.setItem('scrap-theme', 'dark');
    expect(TestBed.inject(ScrapTheme).theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-scrap-theme')).toBe('dark');
  });

  it('ignore une valeur stockée invalide', () => {
    storage.setItem('scrap-theme', 'chartreuse');
    expect(TestBed.inject(ScrapTheme).theme()).toBe('light');
  });

  it("bascule, applique l'attribut et persiste", () => {
    const theme = TestBed.inject(ScrapTheme);
    theme.toggle();
    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-scrap-theme')).toBe('dark');
    expect(storage.getItem('scrap-theme')).toBe('dark');

    theme.toggle();
    expect(theme.theme()).toBe('light');
    expect(storage.getItem('scrap-theme')).toBe('light');
  });

  it('accepte un thème explicite', () => {
    const theme = TestBed.inject(ScrapTheme);
    theme.set('dark');
    expect(theme.theme()).toBe('dark');
  });

  it('survit à un stockage indisponible', () => {
    // Navigation privée, quota dépassé, ou — comme ici — pas de localStorage
    // du tout : le thème doit rester utilisable pour la session.
    removeStorage();
    TestBed.resetTestingModule();
    const theme = TestBed.inject(ScrapTheme);
    expect(theme.theme()).toBe('light');
    expect(() => theme.toggle()).not.toThrow();
    expect(theme.theme()).toBe('dark');
  });
});
