import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ============================================================
// Visualisation audio — modules composables :
//  - scrap-wave-bars : forme d'onde en barres, cliquable (seek)
//  - scrap-wave-line : oscilloscope en trait continu
//  - scrap-vu-meter  : niveau instantané en segments rivetés
//  - scrap-wave-live : branche un AnalyserNode Web Audio sur
//                      l'un des rendus ci-dessus, en temps réel
// Toutes les données sont normalisées 0..1.
// ============================================================

const VIEW_W = 100;
const VIEW_H = 40;
/** Pas de déplacement au clavier, en fraction de la durée totale. */
const KEY_STEP = 0.05;

/**
 * Forme d'onde en barres façon planches de récup, avec position de
 * lecture. Un clic — ou les flèches du clavier — émet le ratio 0..1.
 *
 * ```html
 * <scrap-wave-bars [data]="peaks" [progress]="0.4" (seek)="onSeek($event)" />
 * ```
 */
@Component({
  selector: 'scrap-wave-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + w + ' ' + h"
      preserveAspectRatio="none"
      role="slider"
      tabindex="0"
      [attr.aria-label]="label()"
      aria-valuemin="0"
      aria-valuemax="1"
      [attr.aria-valuenow]="progress() ?? 0"
      [attr.aria-valuetext]="valueText()"
      (click)="onClick($event)"
      (keydown)="onKeydown($event)"
    >
      @for (bar of bars(); track bar.i) {
        <rect
          [attr.x]="bar.x"
          [attr.y]="bar.y"
          [attr.width]="bar.w"
          [attr.height]="bar.h"
          [attr.fill]="bar.played ? 'var(--scrap-accent)' : 'var(--scrap-border-soft)'"
        />
      }
      @if (progress() !== undefined) {
        <rect
          [attr.x]="w * progress()! - 0.35"
          y="0"
          width="0.7"
          [attr.height]="h"
          fill="var(--scrap-ink-strong)"
        />
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      height: 72px;
    }
    svg {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    svg:focus-visible {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 3px;
    }
  `,
})
export class ScrapWaveBars {
  /** Amplitudes normalisées 0..1, une entrée par barre. */
  readonly data = input.required<number[]>();
  /** Position de lecture 0..1 (optionnelle). */
  readonly progress = input<number>();
  /** Étiquette accessible de la piste. */
  readonly label = input('Position de lecture');
  readonly seek = output<number>();

  protected readonly w = VIEW_W;
  protected readonly h = VIEW_H;

  protected readonly valueText = computed(() => {
    const p = this.progress();
    return p === undefined ? null : `${Math.round(p * 100)} %`;
  });

  protected readonly bars = computed(() => {
    const d = this.data();
    const p = this.progress();
    const n = d.length || 1;
    const step = VIEW_W / n;
    const gap = Math.min(step * 0.25, 0.6);
    return d.map((v, i) => {
      const amp = Math.max(0.04, Math.min(1, v));
      const bh = amp * VIEW_H;
      return {
        i,
        x: i * step,
        y: (VIEW_H - bh) / 2,
        w: step - gap,
        h: bh,
        played: p !== undefined && (i + 0.5) / n <= p,
      };
    });
  });

  protected onClick(event: MouseEvent): void {
    const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    if (!rect.width) return;
    this.emit((event.clientX - rect.left) / rect.width);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const current = this.progress() ?? 0;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + KEY_STEP;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - KEY_STEP;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.emit(next);
  }

  private emit(ratio: number): void {
    this.seek.emit(Math.max(0, Math.min(1, ratio)));
  }
}

/**
 * Oscilloscope : trait continu, pour un signal temporel.
 * `<scrap-wave-line [data]="samples" />`
 */
@Component({
  selector: 'scrap-wave-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none" aria-hidden="true">
      <line
        x1="0"
        [attr.y1]="h / 2"
        [attr.x2]="w"
        [attr.y2]="h / 2"
        stroke="var(--scrap-border-soft)"
        stroke-width="0.3"
      />
      <polyline
        [attr.points]="points()"
        fill="none"
        stroke="var(--scrap-accent)"
        stroke-width="0.8"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      height: 72px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class ScrapWaveLine {
  /** Échantillons normalisés 0..1 (0.5 = silence). */
  readonly data = input.required<number[]>();

  protected readonly w = VIEW_W;
  protected readonly h = VIEW_H;

  protected readonly points = computed(() => {
    const d = this.data();
    const n = d.length;
    if (!n) return '';
    return d
      .map((v, i) => `${((i / (n - 1 || 1)) * VIEW_W).toFixed(2)},${((1 - v) * VIEW_H).toFixed(2)}`)
      .join(' ');
  });
}

/**
 * VU-mètre : niveau 0..1 en segments rivetés.
 * Vert mousse → ocre → rouille selon l'intensité.
 * `<scrap-vu-meter [level]="0.7" />`
 */
@Component({
  selector: 'scrap-vu-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rail"
      role="meter"
      [attr.aria-label]="label()"
      [attr.aria-valuenow]="level()"
      aria-valuemin="0"
      aria-valuemax="1"
    >
      @for (seg of segments(); track seg.i) {
        <span class="seg" [class.on]="seg.on" [style.--seg-color]="seg.color"></span>
      }
    </div>
  `,
  styles: `
    .rail {
      display: flex;
      gap: 3px;
      padding: var(--scrap-space-2);
      background: var(--scrap-ink-strong);
      border: var(--scrap-border-w) solid var(--scrap-border);
      box-shadow: var(--scrap-shadow);
    }
    .seg {
      flex: 1;
      height: 18px;
      background: color-mix(in srgb, var(--seg-color) 22%, transparent);
      transform: skewX(-8deg);
      transition: background 60ms linear;
    }
    .seg.on {
      background: var(--seg-color);
    }
  `,
})
export class ScrapVuMeter {
  /** Niveau instantané 0..1. */
  readonly level = input.required<number>();
  readonly count = input(14);
  readonly label = input('Niveau audio');

  protected readonly segments = computed(() => {
    const lvl = this.level();
    const n = this.count();
    return Array.from({ length: n }, (_, i) => {
      const ratio = (i + 1) / n;
      return {
        i,
        on: lvl >= ratio - 1e-6,
        color:
          ratio > 0.85
            ? 'var(--scrap-danger)'
            : ratio > 0.6
              ? 'var(--scrap-warning)'
              : 'var(--scrap-success)',
      };
    });
  });
}

/**
 * Rendu temps réel depuis un AnalyserNode Web Audio.
 *
 * ```ts
 * const ctx = new AudioContext();
 * const analyser = ctx.createAnalyser();
 * source.connect(analyser);
 * // puis : <scrap-wave-live [analyser]="analyser" mode="line" />
 * ```
 *
 * mode "line" = domaine temporel (oscilloscope),
 * mode "bars" = spectre de fréquences.
 *
 * La boucle s'arrête quand l'onglet passe en arrière-plan : inutile de
 * brûler la batterie pour une animation que personne ne regarde.
 */
@Component({
  selector: 'scrap-wave-live',
  imports: [ScrapWaveBars, ScrapWaveLine],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'line') {
      <scrap-wave-line [data]="samples()" />
    } @else {
      <scrap-wave-bars [data]="samples()" />
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ScrapWaveLive {
  readonly analyser = input.required<AnalyserNode>();
  readonly mode = input<'bars' | 'line'>('line');
  /** Nombre de points affichés (le signal est sous-échantillonné). */
  readonly resolution = input(64);

  protected readonly samples = signal<number[]>([]);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rafId = 0;
  private readonly visible = signal(true);

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (this.isBrowser) {
      const onVisibility = () => this.visible.set(this.document.visibilityState === 'visible');
      onVisibility();
      this.document.addEventListener('visibilitychange', onVisibility);
      destroyRef.onDestroy(() =>
        this.document.removeEventListener('visibilitychange', onVisibility),
      );
    }

    destroyRef.onDestroy(() => this.stop());

    effect(() => {
      const analyser = this.analyser();
      const mode = this.mode();
      const res = this.resolution();
      const visible = this.visible();

      this.stop();
      if (!this.isBrowser || !visible) return;

      const buffer = new Uint8Array(
        mode === 'line' ? analyser.fftSize : analyser.frequencyBinCount,
      );
      const tick = () => {
        if (mode === 'line') analyser.getByteTimeDomainData(buffer);
        else analyser.getByteFrequencyData(buffer);
        const step = Math.max(1, Math.floor(buffer.length / res));
        const out: number[] = [];
        for (let i = 0; i < buffer.length; i += step) {
          out.push(buffer[i] / 255);
        }
        this.samples.set(out);
        this.rafId = requestAnimationFrame(tick);
      };
      tick();
    });
  }

  private stop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }
}
