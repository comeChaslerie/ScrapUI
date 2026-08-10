import { Component, input } from '@angular/core';

let nextId = 0;

/**
 * Champ de formulaire : étiquette tampon + contrôle projeté.
 * Le contrôle projeté (input, textarea, select) doit porter
 * la classe globale `scrap-input` (stylée dans _base… voir styles ci-dessous).
 *
 * <scrap-field label="Email" hint="Pro de préférence">
 *   <input class="scrap-input" type="email" />
 * </scrap-field>
 */
@Component({
  selector: 'scrap-field',
  template: `
    <label [attr.for]="controlId">{{ label() }}</label>
    <ng-content />
    @if (hint()) {
      <small>{{ hint() }}</small>
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
  `,
})
export class ScrapField {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  protected readonly controlId = `scrap-field-${nextId++}`;
}
