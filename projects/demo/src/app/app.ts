import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ScrapBadge,
  ScrapButton,
  ScrapCard,
  ScrapEmptyState,
  ScrapErrorPage,
  ScrapField,
  ScrapFooter,
  ScrapHeader,
  ScrapIcon,
  ScrapModal,
  ScrapNavLink,
  ScrapSpinner,
  ScrapSplat,
  ScrapTab,
  ScrapTabs,
  ScrapThemeToggle,
  ScrapToast,
  ScrapToasts,
  ScrapTone,
  ScrapSlider,
  ScrapVuMeter,
  ScrapWaveBars,
  ScrapWaveLine,
} from '@comechaslerie/scrap-ui';

@Component({
  selector: 'app-root',
  imports: [
    ScrapBadge, ScrapButton, ScrapCard, ScrapEmptyState, ScrapErrorPage,
    ScrapField, ScrapFooter, ScrapHeader, ScrapIcon, ScrapModal,
    ScrapSpinner, ScrapSplat, ScrapTab, ScrapTabs, ScrapThemeToggle, ScrapToasts,
    ScrapSlider, ScrapVuMeter, ScrapWaveBars, ScrapWaveLine,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly toast = inject(ScrapToast);

  readonly links: ScrapNavLink[] = [
    { label: 'Composants', href: '#composants' },
    { label: 'Couleurs', href: '#couleurs' },
    { label: 'Typo', href: '#typo' },
  ];

  readonly palette = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Brun foncé', hex: '#322216' },
    { name: 'Cuivre', hex: '#956140' },
    { name: 'Bleu-gris', hex: '#718993' },
    { name: 'Blanc', hex: '#FFFFFF' },
  ];

  readonly icons = ['node', 'gear', 'recycle', 'arrow', 'bolt', 'menu', 'sun', 'moon'];
  readonly tones: ScrapTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];

  readonly modalOpen = signal(false);

  readonly stock = [
    { piece: 'Châssis rouillé', ref: 'CH-042', etat: 'Récupérable' },
    { piece: 'Moteur pas-à-pas', ref: 'MO-118', etat: 'Fonctionnel' },
    { piece: 'Carte mère grillée', ref: 'CM-007', etat: 'Pour pièces' },
  ];

  // --- Démo audio : données factices animées ---
  readonly peaks = Array.from({ length: 64 }, (_, i) =>
    0.25 + 0.7 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.13)) * (0.6 + 0.4 * Math.random()),
  );
  readonly playProgress = signal(0.35);
  readonly oscillo = signal<number[]>([]);
  readonly vuLevel = signal(0);

  // --- Démo sliders ---
  readonly volumeFull = signal(100);
  readonly volumeMid = signal(58);
  readonly volumeOff = signal(0);
  readonly stepped = signal(70);

  volumeIcon(v: number): string {
    return v === 0 ? 'mute' : v < 50 ? 'volume-low' : 'volume';
  }

  readonly cursors = [
    { cls: 'scrap-cursor-cross', label: 'Croix de visée' },
    { cls: 'scrap-cursor-wrench', label: 'Clé à molette' },
    { cls: 'scrap-cursor-marker', label: 'Marqueur' },
    { cls: 'scrap-cursor-spray', label: 'Bombe de peinture' },
    { cls: 'scrap-cursor-gear', label: 'Engrenage' },
  ];

  constructor() {
    // Anime l'oscilloscope et le VU-mètre avec un faux signal.
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      this.oscillo.set(
        Array.from({ length: 96 }, (_, i) => {
          const x = i / 96;
          return 0.5 + 0.32 * Math.sin(x * 20 + t * 4) * Math.sin(x * 3 + t) * (0.7 + 0.3 * Math.sin(t * 2.7));
        }),
      );
      this.vuLevel.set(0.55 + 0.4 * Math.abs(Math.sin(t * 1.8) * Math.sin(t * 0.6)));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(rafId));
  }

  notify(tone: ScrapTone): void {
    const messages: Record<ScrapTone, string> = {
      neutral: 'Noté.',
      info: 'Pièce cataloguée',
      success: 'Enregistré',
      warning: 'Stock faible',
      danger: 'Soudure ratée',
    };
    this.toast.show(messages[tone], tone);
  }
}
