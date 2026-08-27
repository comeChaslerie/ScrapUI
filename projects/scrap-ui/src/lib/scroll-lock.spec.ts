import { TestBed } from '@angular/core/testing';
import { ScrapScrollLock } from './scroll-lock';

describe('ScrapScrollLock', () => {
  let lock: ScrapScrollLock;

  beforeEach(() => {
    document.body.style.overflow = '';
    TestBed.resetTestingModule();
    lock = TestBed.inject(ScrapScrollLock);
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('bloque puis rend le défilement', () => {
    const release = lock.acquire();
    expect(document.body.style.overflow).toBe('hidden');
    release();
    expect(document.body.style.overflow).toBe('');
  });

  it('attend le dernier relâchement quand deux verrous se superposent', () => {
    const first = lock.acquire();
    const second = lock.acquire();

    // Deux modales ouvertes : refermer la première ne doit pas rendre le
    // défilement pendant que la seconde est encore là.
    first();
    expect(document.body.style.overflow).toBe('hidden');
    second();
    expect(document.body.style.overflow).toBe('');
  });

  it('ignore un relâchement répété', () => {
    const release = lock.acquire();
    release();
    release();
    expect(document.body.style.overflow).toBe('');

    lock.acquire();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restaure la valeur qui était déjà posée sur le corps', () => {
    document.body.style.overflow = 'scroll';
    const release = lock.acquire();
    expect(document.body.style.overflow).toBe('hidden');
    release();
    // Écraser en '' effacerait un réglage appartenant à l'application hôte.
    expect(document.body.style.overflow).toBe('scroll');
  });
});
