import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Set d'icônes maison, tracé volontairement anguleux/brut pour coller
// à l'esprit récup de la charte. Toutes en currentColor.
const ICONS: Record<string, string> = {
  node: '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.7 3.7L12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.3l-6-3.3V9.7Zm14 0V16l-6 3.3V13l6-3.3Z"/>',
  gear: '<path d="m14.2 2 .5 2.4 1.9.8 2-1.3 2.2 2.2-1.3 2 .8 1.9 2.4.5v3l-2.4.5-.8 1.9 1.3 2-2.2 2.2-2-1.3-1.9.8-.5 2.4h-3l-.5-2.4-1.9-.8-2 1.3-2.2-2.2 1.3-2-.8-1.9L2 14.2v-3l2.4-.5.8-1.9-1.3-2 2.2-2.2 2 1.3 1.9-.8.5-2.4h3ZM12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z"/>',
  recycle: '<path d="M12 3 8.5 9h2.3L12 6.9 13.8 10l2.1-1.2L12 3ZM4 18l3.4-6 2 1.2L8 15.6h3.6V18H4Zm16 0h-6.4v-2.4h3.1L15 12.9l2-1.2L20.4 18H20Z"/>',
  arrow: '<path d="M4 11h12.2l-4.6-4.6L13.3 4.7 20.6 12l-7.3 7.3-1.7-1.7 4.6-4.6H4v-2Z"/>',
  menu: '<path d="M3 5h18v2.5H3V5Zm0 5.8h18v2.5H3v-2.5Zm0 5.7h18V19H3v-2.5Z"/>',
  close: '<path d="m5 6.8 1.8-1.8L12 10.2 17.2 5 19 6.8 13.8 12l5.2 5.2-1.8 1.8-5.2-5.2L6.8 19 5 17.2 10.2 12 5 6.8Z"/>',
  sun: '<path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-1-6h2v3.5h-2V1Zm0 19.5h2V24h-2v-3.5ZM1 11h3.5v2H1v-2Zm18.5 0H23v2h-3.5v-2ZM4.2 5.6l1.4-1.4 2.5 2.5-1.4 1.4-2.5-2.5Zm11.7 11.7 1.4-1.4 2.5 2.5-1.4 1.4-2.5-2.5Zm2.5-13.1 1.4 1.4-2.5 2.5-1.4-1.4 2.5-2.5ZM5.6 19.8l-1.4-1.4 2.5-2.5 1.4 1.4-2.5 2.5Z"/>',
  moon: '<path d="M20 14.6A8.5 8.5 0 0 1 9.4 4 8.5 8.5 0 1 0 20 14.6Z"/>',
  bolt: '<path d="M13.5 2 5 13.5h5L9.5 22 19 9.5h-5.5L13.5 2Z"/>',
  volume: '<path d="M3 9v6h4l5 5V4L7 9H3Zm13.2 3a4.2 4.2 0 0 0-2.2-3.7v7.4a4.2 4.2 0 0 0 2.2-3.7ZM14 2.3v2.1a8 8 0 0 1 0 15.2v2.1a10 10 0 0 0 0-19.4Z"/>',
  'volume-low': '<path d="M5 9v6h4l5 5V4L9 9H5Zm13.2 3a4.2 4.2 0 0 0-2.2-3.7v7.4a4.2 4.2 0 0 0 2.2-3.7Z"/>',
  mute: '<path d="M3 9v6h4l5 5V4L7 9H3Zm18.1 0-1.6-1.6-2.5 2.5-2.5-2.5L12.9 9l2.5 2.5-2.5 2.5 1.6 1.6 2.5-2.5 2.5 2.5 1.6-1.6-2.5-2.5L21.1 9Z"/>',
};

export type ScrapIconName = keyof typeof ICONS;

@Component({
  selector: 'scrap-icon',
  template: `<svg
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    [innerHTML]="path()"
  ></svg>`,
  styles: `
    :host { display: inline-flex; vertical-align: middle; }
  `,
})
export class ScrapIcon {
  readonly name = input.required<string>();
  readonly size = input(20);
  private readonly sanitizer = inject(DomSanitizer);
  // Les tracés sont des constantes internes de la lib : le bypass est sûr.
  protected readonly path = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()] ?? ''),
  );
}
