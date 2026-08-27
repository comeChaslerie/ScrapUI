/**
 * jsdom n'implémente pas `<dialog>` : `showModal()` et `close()` n'existent
 * pas sur le prototype. On pose un substitut minimal, juste assez pour
 * vérifier le câblage du composant.
 *
 * Ce que ce substitut NE simule pas — piège de focus, restauration du focus,
 * fermeture par Échap, arrière-plan inerte — est précisément ce que le
 * navigateur fournit et que les tests de régression visuelle Playwright
 * exercent pour de vrai.
 */
export function installDialogPolyfill(): void {
  const proto = globalThis.HTMLDialogElement?.prototype as
    (HTMLDialogElement & { __scrapPolyfilled?: boolean }) | undefined;
  if (!proto || proto.__scrapPolyfilled) return;

  proto.__scrapPolyfilled = true;
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  proto.show = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  proto.close = function (this: HTMLDialogElement, returnValue?: string) {
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
