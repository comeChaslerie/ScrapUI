import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { ScrapIdGenerator } from './id';

/**
 * Champ de formulaire : étiquette tampon + contrôle projeté.
 *
 * Le contrôle projeté porte la directive `scrapInput`, qui se charge de lier
 * l'étiquette, l'indice et le message d'erreur au contrôle :
 *
 * ```html
 * <scrap-field label="Email" hint="Pro de préférence">
 *   <input scrapInput type="email" />
 * </scrap-field>
 * ```
 */
@Component({
  selector: 'scrap-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [attr.for]="controlId">{{ label() }}</label>
    <ng-content />
    @if (hint()) {
      <small [id]="hintId">{{ hint() }}</small>
    }
    @if (error()) {
      <small class="error" [id]="errorId" role="alert">{{ error() }}</small>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--scrap-space-1);
    }
    label {
      font-family: var(--scrap-font-display);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: var(--scrap-fs-small);
      color: var(--scrap-ink-strong);
    }
    small {
      color: var(--scrap-ink-muted);
      font-size: 0.8rem;
    }
    small.error {
      color: var(--scrap-danger);
      font-weight: 700;
    }
    ::ng-deep .scrap-input {
      font-family: var(--scrap-font-body);
      font-size: var(--scrap-fs-body);
      color: var(--scrap-ink);
      background: var(--scrap-bg-alt);
      border: var(--scrap-border-w) solid var(--scrap-border);
      border-radius: var(--scrap-radius);
      padding: 0.65em 0.9em;
      transition: box-shadow var(--scrap-transition);
    }
    ::ng-deep .scrap-input:focus {
      outline: none;
      box-shadow: var(--scrap-shadow);
    }
    ::ng-deep .scrap-input::placeholder {
      color: var(--scrap-ink-muted);
    }
    ::ng-deep .scrap-input[aria-invalid='true'] {
      border-color: var(--scrap-danger);
    }
  `,
})
export class ScrapField {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  /** Message d'erreur. Présent = le contrôle est marqué `aria-invalid`. */
  readonly error = input<string>();

  private readonly ids = inject(ScrapIdGenerator);
  readonly controlId = this.ids.next('scrap-field');
  readonly hintId = `${this.controlId}-hint`;
  readonly errorId = `${this.controlId}-error`;

  /** Valeur de `aria-describedby` à poser sur le contrôle. */
  readonly describedBy = computed(() => {
    const parts = [this.hint() ? this.hintId : null, this.error() ? this.errorId : null];
    const joined = parts.filter(Boolean).join(' ');
    return joined || null;
  });
}

/**
 * À poser sur le contrôle projeté dans un `<scrap-field>` : applique le style
 * de la charte et branche les liaisons ARIA vers l'étiquette et les messages.
 *
 * Utilisable hors d'un `scrap-field` — dans ce cas elle ne fait que styler.
 */
@Directive({
  selector: '[scrapInput]',
  host: {
    class: 'scrap-input',
    '[attr.id]': 'controlId',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-invalid]': 'field?.error() ? "true" : null',
  },
})
export class ScrapInput {
  protected readonly field = inject(ScrapField, { optional: true });

  /**
   * Hors d'un `scrap-field`, on rend l'id que le consommateur a posé
   * lui-même : un binding qui retournerait `null` effacerait son attribut.
   */
  private readonly ownId = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.id;
  protected readonly controlId = this.field?.controlId ?? this.ownId ?? null;
}
