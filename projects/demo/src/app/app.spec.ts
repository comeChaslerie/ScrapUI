import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { STORIES, routes } from './app.routes';

describe('Vitrine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('rend un lien de navigation par story déclarée', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = [...fixture.nativeElement.querySelectorAll('.stories a')] as HTMLAnchorElement[];
    expect(links.map((a) => a.textContent?.trim())).toEqual(STORIES.map((s) => s.title));
  });

  it('redirige la racine vers les fondations', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/fondations');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Fondations');
  });

  it('charge chaque story déclarée', async () => {
    // Garde-fou contre une entrée de STORIES sans route correspondante :
    // la vitrine afficherait alors un 404 au lieu du composant.
    const harness = await RouterTestingHarness.create();
    for (const story of STORIES) {
      await harness.navigateByUrl(`/${story.path}`);
      const heading = harness.routeNativeElement?.querySelector('h1')?.textContent ?? '';
      expect(heading, story.path).not.toContain('404');
      expect(heading.trim(), story.path).toBeTruthy();
    }
  });

  it('affiche la page 404 sur une route inconnue', async () => {
    const harness = await RouterTestingHarness.create('/piece-inexistante');
    expect(harness.routeNativeElement?.textContent).toContain('404');
  });
});
