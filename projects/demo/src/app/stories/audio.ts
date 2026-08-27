import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ScrapButton, ScrapVuMeter, ScrapWaveBars, ScrapWaveLine } from '@comechaslerie/scrap-ui';
import { StoryCase, StoryPage } from '../story-page';

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32).
 *
 * `Math.random` rendrait chaque rendu différent, donc chaque capture de
 * régression visuelle différente : la story serait ininterprétable.
 */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(42);
const PEAKS = Array.from(
  { length: 64 },
  (_, i) => 0.25 + 0.7 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.13)) * (0.6 + 0.4 * rand()),
);
const OSCILLO = Array.from({ length: 96 }, (_, i) => {
  const x = i / 96;
  return 0.5 + 0.32 * Math.sin(x * 20) * Math.sin(x * 3);
});

@Component({
  selector: 'story-audio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StoryPage, StoryCase, ScrapWaveBars, ScrapWaveLine, ScrapVuMeter, ScrapButton],
  template: `
    <story-page
      title="Visualisation audio"
      lead="Quatre modules composables, tous alimentés par des données normalisées 0..1."
    >
      <story-case
        name="Forme d'onde"
        note="Clic ou flèches du clavier pour déplacer la tête de lecture."
        [stack]="true"
      >
        <scrap-wave-bars [data]="peaks" [progress]="progress()" (seek)="progress.set($event)" />
        <p class="readout">Position : {{ (progress() * 100).toFixed(0) }} %</p>
      </story-case>

      <story-case name="Forme d'onde sans tête de lecture" [stack]="true">
        <scrap-wave-bars [data]="peaks" />
      </story-case>

      <story-case name="Oscilloscope" [stack]="true">
        <scrap-wave-line [data]="oscillo()" />
      </story-case>

      <story-case name="VU-mètre" [stack]="true">
        <scrap-vu-meter [level]="level()" />
        <scrap-vu-meter [level]="level()" [count]="24" />
      </story-case>

      <story-case
        name="Animation"
        note="Coupée par défaut : les stories doivent rendre la même image à chaque capture."
      >
        <button scrap-button (click)="toggle()">
          {{ playing() ? 'Arrêter' : 'Animer le signal' }}
        </button>
      </story-case>
    </story-page>
  `,
  styles: `
    .readout {
      margin: 0;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-muted);
    }
  `,
})
export class AudioStory {
  readonly peaks = PEAKS;
  readonly progress = signal(0.35);
  readonly oscillo = signal<number[]>(OSCILLO);
  readonly level = signal(0.72);
  readonly playing = signal(false);

  private rafId = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  toggle(): void {
    if (this.playing()) {
      this.stop();
      this.oscillo.set(OSCILLO);
      this.level.set(0.72);
      return;
    }
    this.playing.set(true);
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      this.oscillo.set(
        Array.from({ length: 96 }, (_, i) => {
          const x = i / 96;
          return (
            0.5 +
            0.32 * Math.sin(x * 20 + t * 4) * Math.sin(x * 3 + t) * (0.7 + 0.3 * Math.sin(t * 2.7))
          );
        }),
      );
      this.level.set(0.55 + 0.4 * Math.abs(Math.sin(t * 1.8) * Math.sin(t * 0.6)));
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.playing.set(false);
  }
}
