import { Component, inject, signal } from '@angular/core';
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
} from 'scrap-ui';

@Component({
  selector: 'app-root',
  imports: [
    ScrapBadge, ScrapButton, ScrapCard, ScrapEmptyState, ScrapErrorPage,
    ScrapField, ScrapFooter, ScrapHeader, ScrapIcon, ScrapModal,
    ScrapSpinner, ScrapSplat, ScrapTab, ScrapTabs, ScrapThemeToggle, ScrapToasts,
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
