import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrapModal } from './modal';
import { ScrapScrollLock } from './scroll-lock';
import { ScrapTheme } from './theme';
import { ScrapThemeToggle } from './theme-toggle';
import { removeStorage } from '../testing/fake-storage';

/**
 * Sûreté côté serveur.
 *
 * En SSR et au prerender, `localStorage`, `matchMedia` et la mutation du DOM
 * n'existent pas ou ne doivent pas être touchés. Ces tests forcent
 * `PLATFORM_ID` à `'server'` : c'est exactement ce que voit un composant rendu
 * par Angular Universal.
 */
describe('rendu serveur', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    document.documentElement.removeAttribute('data-scrap-theme');
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-scrap-theme');
    document.body.style.overflow = '';
  });

  describe('ScrapTheme', () => {
    it('ne touche pas au document', () => {
      const theme = TestBed.inject(ScrapTheme);
      expect(theme.theme()).toBe('light');
      // Le serveur ne connaît pas la préférence de l'utilisateur : poser
      // l'attribut ici produirait un HTML qui contredit son choix réel,
      // avec un clignotement à l'hydratation.
      expect(document.documentElement.hasAttribute('data-scrap-theme')).toBe(false);
    });

    it('ignore les écritures', () => {
      const theme = TestBed.inject(ScrapTheme);
      theme.set('dark');
      expect(theme.theme()).toBe('light');
      expect(document.documentElement.hasAttribute('data-scrap-theme')).toBe(false);
    });

    it('ne lève pas sans stockage du tout', () => {
      removeStorage();
      expect(() => TestBed.inject(ScrapTheme).toggle()).not.toThrow();
    });
  });

  describe('ScrapScrollLock', () => {
    it('ne verrouille pas le corps du document', () => {
      const release = TestBed.inject(ScrapScrollLock).acquire();
      expect(document.body.style.overflow).toBe('');
      expect(() => release()).not.toThrow();
    });
  });

  describe('ScrapThemeToggle', () => {
    it('se rend sans erreur', async () => {
      const fixture = TestBed.createComponent(ScrapThemeToggle);
      await fixture.whenStable();
      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.getAttribute('aria-label')).toBe('Passer en mode sombre');
    });
  });

  describe('ScrapModal', () => {
    it("se rend fermée sans appeler l'API <dialog>", async () => {
      // Aucun polyfill installé ici : si le composant appelait showModal()
      // côté serveur, ce test lèverait « showModal is not a function ».
      const fixture = TestBed.createComponent(ScrapModal);
      fixture.componentRef.setInput('title', 'Confirmer');
      fixture.componentRef.setInput('open', true);
      await fixture.whenStable();

      const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
      expect(dialog).not.toBeNull();
      expect(dialog.hasAttribute('open')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });
});
