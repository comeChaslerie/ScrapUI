import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ScrapThemeName = 'light' | 'dark';

const STORAGE_KEY = 'scrap-theme';

/**
 * État du thème, partagé par toute l'application.
 *
 * Sur le serveur (SSR/prerender) rien n'est touché : le thème reste `light`
 * et la bascule réelle se fait à l'hydratation, une fois `document`,
 * `localStorage` et `matchMedia` disponibles.
 */
@Injectable({ providedIn: 'root' })
export class ScrapTheme {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly state = signal<ScrapThemeName>('light');

  /** Thème courant. Toujours `light` tant qu'on n'est pas dans un navigateur. */
  readonly theme = this.state.asReadonly();

  constructor() {
    if (!this.isBrowser) return;
    this.apply(this.stored() ?? this.systemPreference());
  }

  set(theme: ScrapThemeName): void {
    if (!this.isBrowser) return;
    this.apply(theme);
    this.persist(theme);
  }

  toggle(): void {
    this.set(this.state() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: ScrapThemeName): void {
    this.state.set(theme);
    this.document.documentElement.setAttribute('data-scrap-theme', theme);
  }

  private stored(): ScrapThemeName | null {
    const raw = this.safeStorage()?.getItem(STORAGE_KEY);
    return raw === 'dark' || raw === 'light' ? raw : null;
  }

  private persist(theme: ScrapThemeName): void {
    try {
      this.safeStorage()?.setItem(STORAGE_KEY, theme);
    } catch {
      // Stockage indisponible (navigation privée, quota) : le thème reste
      // valable pour la session en cours, on n'a rien de plus à faire.
    }
  }

  private safeStorage(): Storage | null {
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private systemPreference(): ScrapThemeName {
    const view = this.document.defaultView;
    return view?.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
