import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrapFooter, ScrapHeader, ScrapThemeToggle, ScrapToasts } from '@comechaslerie/scrap-ui';
import { STORIES } from './app.routes';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ScrapHeader,
    ScrapFooter,
    ScrapThemeToggle,
    ScrapToasts,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly stories = STORIES;
}
