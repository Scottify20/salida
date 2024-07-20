import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScrollPositionService } from './shared/services/scroll-position.service';
import { DOCUMENT } from '@angular/common';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Salida';
  excludeRoutes: string[] = ['/lists']; // excluded routes for scroll position saving

  constructor(
    private router: Router,
    private scrollPositionService: ScrollPositionService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart &&
            event.navigationTrigger !== 'popstate' && // Navbar clicks
            !this.excludeRoutes.includes(event.url) // Exclude specified routes
        )
      )
      .subscribe(() => {
        const mainElement = this.document.querySelector('main');
        if (mainElement) {
          this.scrollPositionService.savePosition(
            this.router.url,
            mainElement.scrollTop // Save main's scroll
          );
        }
      });
  }
}
