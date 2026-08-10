import { Component, computed, input, model } from '@angular/core';

/**
 * Curseur de réglage : piste remplie côté cuivre, crans optionnels,
 * libellés min/max, emplacement icône à gauche.
 *
 * <scrap-slider [(value)]="volume" icon>
 *   <scrap-icon icon name="volume" />
 * </scrap-slider>
 *
 * Options : [min] [max] [step] [ticks]="true" [showBounds]="false" [disabled]="true"
 */
@Component({
  selector: 'scrap-slider',
  template: `
    <ng-content select="[icon]" />
    @if (showBounds()) {
      <span class="bound">{{ min() }}</span>
    }
    <div class="track-zone">
      @if (ticks()) {
        <div class="ticks">
          @for (t of tickList(); track t) {
            <span class="tick" [class.on]="!disabled() && t <= ratio()"></span>
          }
        </div>
      }
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [style.--fill]="disabled() ? '0' : ratio()"
        (input)="onInput($event)"
      />
    </div>
    @if (showBounds()) {
      <span class="bound">{{ max() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-3);
      color: var(--scrap-accent);
    }
    :host(.disabled) { color: var(--scrap-ink-muted); }

    .bound {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-muted);
      min-width: 2.2em;
      text-align: center;
    }

    .track-zone { position: relative; flex: 1; display: flex; align-items: center; }

    input[type='range'] {
      appearance: none;
      width: 100%;
      height: 26px;
      margin: 0;
      background: transparent;
      cursor: pointer;
      position: relative;
      z-index: 1;
    }
    input[type='range']:disabled { cursor: not-allowed; }

    /* Piste : partie lue en cuivre, reste en gris doux */
    input[type='range']::-webkit-slider-runnable-track {
      height: 5px;
      border-radius: var(--scrap-radius);
      background: linear-gradient(
        to right,
        var(--scrap-accent) 0,
        var(--scrap-accent) calc(var(--fill) * 100%),
        var(--scrap-border-soft) calc(var(--fill) * 100%),
        var(--scrap-border-soft) 100%
      );
    }
    input[type='range']:disabled::-webkit-slider-runnable-track {
      background: var(--scrap-border-soft);
    }

    /* Poignée : rivet massif, ombre dure, léger désaxage */
    input[type='range']::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      margin-top: -6.5px;
      border-radius: 50%;
      background: var(--scrap-accent);
      border: var(--scrap-border-w) solid var(--scrap-border);
      box-shadow: 2px 2px 0 var(--scrap-border);
      transition: transform var(--scrap-transition);
    }
    input[type='range']:hover::-webkit-slider-thumb { transform: scale(1.15); }
    input[type='range']:active::-webkit-slider-thumb { transform: scale(0.95); }
    input[type='range']:disabled::-webkit-slider-thumb {
      background: var(--scrap-border-soft);
      box-shadow: none;
      transform: none;
    }
    input[type='range']:focus-visible {
      outline: 3px dashed var(--scrap-secondary);
      outline-offset: 3px;
    }

    /* Firefox */
    input[type='range']::-moz-range-track {
      height: 5px;
      border-radius: var(--scrap-radius);
      background: var(--scrap-border-soft);
    }
    input[type='range']::-moz-range-progress {
      height: 5px;
      border-radius: var(--scrap-radius);
      background: var(--scrap-accent);
    }
    input[type='range']::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--scrap-accent);
      border: var(--scrap-border-w) solid var(--scrap-border);
      box-shadow: 2px 2px 0 var(--scrap-border);
    }

    /* Crans */
    .ticks {
      position: absolute;
      inset: 0 9px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
    }
    .tick {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--scrap-border-soft);
      transform: rotate(45deg);
    }
    .tick.on { background: var(--scrap-accent); }
  `,
  host: { '[class.disabled]': 'disabled()' },
})
export class ScrapSlider {
  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  /** Affiche des crans régulièrement espacés (suit `step` si <= 20 crans, sinon 10). */
  readonly ticks = input(false);
  readonly showBounds = input(true);
  readonly disabled = input(false);

  protected readonly ratio = computed(() => {
    const span = this.max() - this.min() || 1;
    return Math.max(0, Math.min(1, (this.value() - this.min()) / span));
  });

  protected readonly tickList = computed(() => {
    const span = this.max() - this.min() || 1;
    const byStep = span / this.step();
    const n = byStep >= 2 && byStep <= 20 ? byStep : 10;
    return Array.from({ length: n + 1 }, (_, i) => i / n);
  });

  protected onInput(event: Event): void {
    this.value.set(Number((event.target as HTMLInputElement).value));
  }
}
