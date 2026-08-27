/**
 * Registre des stories : une entrée = une page de la vitrine.
 *
 * Volontairement sans dépendance Angular : ce module est importé aussi bien
 * par les routes que par les tests Playwright, qui tournent hors du
 * compilateur Angular. Une seule liste à tenir à jour quand un composant arrive.
 */
export interface Story {
  readonly path: string;
  readonly title: string;
}

export const STORIES: readonly Story[] = [
  { path: 'fondations', title: 'Fondations' },
  { path: 'layout', title: 'Layout' },
  { path: 'boutons', title: 'Boutons' },
  { path: 'badges', title: 'Badges' },
  { path: 'cartes', title: 'Cartes' },
  { path: 'formulaires', title: 'Formulaires' },
  { path: 'onglets', title: 'Onglets' },
  { path: 'curseurs', title: 'Curseurs' },
  { path: 'modale-toasts', title: 'Modale & toasts' },
  { path: 'etats', title: 'États' },
  { path: 'icones', title: 'Icônes' },
  { path: 'audio', title: 'Audio' },
  { path: 'utilitaires', title: 'Utilitaires' },
];
