import { Injectable } from '@angular/core';

/**
 * Générateur d'identifiants uniques pour les liaisons ARIA.
 *
 * Volontairement `providedIn: 'root'` plutôt qu'un compteur de module :
 * en SSR, chaque requête construit son propre injecteur racine, donc son
 * propre compteur. Le serveur et le client repartent tous deux de 0 et
 * produisent les mêmes identifiants — pas de divergence à l'hydratation.
 */
@Injectable({ providedIn: 'root' })
export class ScrapIdGenerator {
  private counter = 0;

  next(prefix: string): string {
    return `${prefix}-${this.counter++}`;
  }
}
