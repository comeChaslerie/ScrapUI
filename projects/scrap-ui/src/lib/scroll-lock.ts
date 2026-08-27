import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Verrou de défilement de la page, à compteur.
 *
 * Le `<dialog>` natif inerte l'arrière-plan mais ne bloque pas son
 * défilement. Le faire naïvement depuis chaque modale pose deux problèmes :
 * avec deux modales ouvertes, la première refermée rendrait le défilement à
 * la place de la seconde ; et remettre `overflow` à `''` effacerait un
 * réglage appartenant à l'application hôte.
 */
@Injectable({ providedIn: 'root' })
export class ScrapScrollLock {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private depth = 0;
  private previous = '';

  /** Bloque le défilement. Renvoie la fonction qui le rend — idempotente. */
  acquire(): () => void {
    if (!this.isBrowser) return () => undefined;

    if (this.depth++ === 0) {
      this.previous = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
    }

    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (--this.depth === 0) {
        this.document.body.style.overflow = this.previous;
      }
    };
  }
}
