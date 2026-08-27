import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Curseur de réglage : piste remplie côté cuivre, crans optionnels,
 * libellés min/max, emplacement icône à gauche.
 *
 * ```html
 * <scrap-slider [(value)]="volume" label="Volume">
 *   <scrap-icon icon name="volume" />
 * </scrap-slider>
 * ```
 *
 * Utilisable aussi avec les formulaires Angular (`formControlName`,
 * `[(ngModel)]`) : le composant implémente `ControlValueAccessor`.
 *
 * Options : `[min] [max] [step] [ticks] [showBounds] [disabled] [label]`
 */
@Component({
  selector: 'scrap-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScrapSlider),
      multi: true,
    },
  ],
  template: `
    <ng-content select="[icon]" />
    @if (showBounds()) {
      <span class="bound" aria-hidden="true">{{ min() }}</span>
    }
    <div class="track-zone">
      @if (ticks()) {
        <div class="ticks" aria-hidden="true">
          @for (t of tickList(); track t) {
            <span class="tick" [class.on]="!isDisabled() && t <= ratio()"></span>
          }
        </div>
      }
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="isDisabled()"
        [attr.aria-label]="label()"
        [style.--fill]="isDisabled() ? '0' : ratio()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </div>
    @if (showBounds()) {
      <span class="bound" aria-hidden="true">{{ max() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--scrap-space-3);
      color: var(--scrap-accent);
    }
    :host(.disabled) {
      color: var(--scrap-ink-muted);
    }

    .bound {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-muted);
      min-width: 2.2em;
      text-align: center;
    }

    .track-zone {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }

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
    input[type='range']:disabled {
      cursor: not-allowed;
    }

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
    input[type='range']:hover::-webkit-slider-thumb {
      transform: scale(1.15);
    }
    input[type='range']:active::-webkit-slider-thumb {
      transform: scale(0.95);
    }
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
    .tick.on {
      background: var(--scrap-accent);
    }

    @media (prefers-reduced-motion: reduce) {
      input[type='range']::-webkit-slider-thumb {
        transition: none;
      }
    }
  `,
  host: { '[class.disabled]': 'isDisabled()' },
})
export class ScrapSlider implements ControlValueAccessor {
  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  /** Affiche des crans régulièrement espacés (suit `step` si <= 20 crans, sinon 10). */
  readonly ticks = input(false);
  readonly showBounds = input(true);
  readonly disabled = input(false);
  /** Étiquette accessible du curseur. */
  readonly label = input<string>();

  /** Désactivation via l'entrée `disabled` ou via `FormControl.disable()`. */
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

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
    const next = Number((event.target as HTMLInputElement).value);
    this.value.set(next);
    this.onChange(next);
  }

  // --- ControlValueAccessor ---
  // Rappels neutres tant que le composant n'est pas relié à un FormControl :
  // Angular les remplace via registerOnChange / registerOnTouched.
  protected onTouched: () => void = () => undefined;
  private onChange: (value: number) => void = () => undefined;

  writeValue(value: number | null): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }
}
