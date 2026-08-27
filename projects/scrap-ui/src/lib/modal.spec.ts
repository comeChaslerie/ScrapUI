import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrapModal } from './modal';
import { installDialogPolyfill } from '../testing/dialog-polyfill';

@Component({
  imports: [ScrapModal],
  template: `
    <scrap-modal [(open)]="open" title="Confirmer">
      <p>Corps</p>
      <div actions><button>OK</button></div>
    </scrap-modal>
  `,
})
class Host {
  readonly open = signal(false);
}

describe('ScrapModal', () => {
  let fixture: ComponentFixture<Host>;
  const dialog = () => fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

  beforeEach(async () => {
    installDialogPolyfill();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('reste fermée au départ', () => {
    expect(dialog().open).toBe(false);
  });

  it("s'ouvre et se ferme au gré de l'entrée open", async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(dialog().open).toBe(true);

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    expect(dialog().open).toBe(false);
  });

  it('bloque puis rend le défilement de la page', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('hidden');

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('');
  });

  it('nomme la boîte de dialogue par son titre', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    const titleId = dialog().getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`#${titleId}`).textContent.trim()).toBe('Confirmer');
  });

  it('se referme via le bouton de fermeture', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('button.x') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('se referme au clic sur le fond, pas sur la plaque', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.plate') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(true);

    dialog().click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it("remonte la fermeture native (Échap) dans l'entrée open", async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    // Le <dialog> natif gère Échap tout seul : il faut que le signal suive.
    dialog().dispatchEvent(new Event('close'));
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('rend le défilement si la modale est détruite ouverte', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('hidden');

    // Une navigation qui détruit la vue pendant que la modale est ouverte
    // laissait la page verrouillée pour de bon.
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  it('projette le corps et les actions', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.body p').textContent).toBe('Corps');
    expect(fixture.nativeElement.querySelector('.actions button').textContent).toBe('OK');
  });
});
