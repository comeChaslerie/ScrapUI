import { Component, signal } from '@angular/core';
import { ScrapIcon } from './icon';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'scrap-theme';

/**
 * Bascule clair/sombre : pose data-scrap-theme sur <html>
 * et mémorise le choix dans localStorage.
 */
@Component({
  selector: 'scrap-theme-toggle',
  imports: [ScrapIcon],
  template: `
    <button type="button" (click)="toggle()" [attr.aria-label]="'Passer en mode ' + next()">
      <scrap-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" [size]="18" />
    </button>
  `,
  styles: `
    button {
      display: inline-flex;
      padding: 0.5em;
      background: transparent;
      color: inherit;
      border: var(--scrap-border-w) solid currentColor;
      border-radius: var(--scrap-radius);
      cursor: pointer;
      transform: rotate(2deg);
      transition: transform var(--scrap-transition);
    }
    button:hover { transform: rotate(-2deg) scale(1.05); }
  `,
})
export class ScrapThemeToggle {
  protected readonly theme = signal<Theme>(this.initial());

  protected next(): Theme {
    return this.theme() === 'dark' ? 'light' : 'dark';
  }

  protected toggle(): void {
    const t = this.next();
    this.theme.set(t);
    document.documentElement.setAttribute('data-scrap-theme', t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }

  private initial(): Theme {
    let t: Theme | null = null;
    try {
      t = localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {}
    t ??= matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-scrap-theme', t);
    return t;
  }
}
