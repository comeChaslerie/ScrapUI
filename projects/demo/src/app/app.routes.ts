import { Routes } from '@angular/router';

export { STORIES, type Story } from './stories.data';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'fondations' },
  {
    path: 'fondations',
    loadComponent: () => import('./stories/tokens').then((m) => m.TokensStory),
  },
  { path: 'layout', loadComponent: () => import('./stories/layout').then((m) => m.LayoutStory) },
  { path: 'boutons', loadComponent: () => import('./stories/buttons').then((m) => m.ButtonsStory) },
  { path: 'badges', loadComponent: () => import('./stories/badges').then((m) => m.BadgesStory) },
  { path: 'cartes', loadComponent: () => import('./stories/cards').then((m) => m.CardsStory) },
  {
    path: 'formulaires',
    loadComponent: () => import('./stories/forms').then((m) => m.FormsStory),
  },
  { path: 'onglets', loadComponent: () => import('./stories/tabs').then((m) => m.TabsStory) },
  {
    path: 'curseurs',
    loadComponent: () => import('./stories/sliders').then((m) => m.SlidersStory),
  },
  {
    path: 'modale-toasts',
    loadComponent: () => import('./stories/overlays').then((m) => m.OverlaysStory),
  },
  { path: 'etats', loadComponent: () => import('./stories/feedback').then((m) => m.FeedbackStory) },
  {
    path: 'icones',
    loadComponent: () => import('./stories/iconography').then((m) => m.IconographyStory),
  },
  { path: 'audio', loadComponent: () => import('./stories/audio').then((m) => m.AudioStory) },
  {
    path: 'utilitaires',
    loadComponent: () => import('./stories/utilities').then((m) => m.UtilitiesStory),
  },
  { path: '**', loadComponent: () => import('./not-found').then((m) => m.NotFound) },
];
