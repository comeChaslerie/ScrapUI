import { TestBed } from '@angular/core/testing';
import { ScrapIdGenerator } from './id';

describe('ScrapIdGenerator', () => {
  it('produit des identifiants uniques et préfixés', () => {
    const ids = TestBed.inject(ScrapIdGenerator);
    expect(ids.next('a')).toBe('a-0');
    expect(ids.next('a')).toBe('a-1');
    expect(ids.next('b')).toBe('b-2');
  });

  it('repart de zéro dans un nouvel injecteur racine', () => {
    expect(TestBed.inject(ScrapIdGenerator).next('x')).toBe('x-0');
    TestBed.resetTestingModule();
    // C'est ce comportement qui garantit l'absence de divergence
    // serveur/client à l'hydratation : une requête = un injecteur = un compteur.
    expect(TestBed.inject(ScrapIdGenerator).next('x')).toBe('x-0');
  });
});
