import { Component } from '@angular/core';
import {
  ScrapButton,
  ScrapCard,
  ScrapField,
  ScrapFooter,
  ScrapHeader,
  ScrapIcon,
  ScrapNavLink,
  ScrapThemeToggle,
} from 'scrap-ui';

@Component({
  selector: 'app-root',
  imports: [ScrapButton, ScrapCard, ScrapField, ScrapFooter, ScrapHeader, ScrapIcon, ScrapThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
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
}
