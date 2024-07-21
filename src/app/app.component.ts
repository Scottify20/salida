import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map, fromEvent, Subscription } from 'rxjs';
import { ScrollPositionService } from './shared/services/scroll-position-service.service';
import { PlatformCheckService } from './shared/services/platform-check.service';
import { NavComponent } from './nav/nav.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private scrollSubscription?: Subscription;

  constructor(
    private router: Router,
    private scrollPositionService: ScrollPositionService,
    private platformCheck: PlatformCheckService
  ) {}

  ngOnInit() {
    if (this.platformCheck.isBrowser()) {
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          ),
          map((event) => event.urlAfterRedirects) // No need to normalize here
        )
        .subscribe((urlAfterRedirects) => {
          // ... (Scroll restoration logic)
          setTimeout(() => {
            const scrollPos =
              this.scrollPositionService.getScrollPosition(urlAfterRedirects);
            window.scrollTo(0, scrollPos);
          }, 100);

          // ... (Unsubscribe and new scroll listener logic)
          if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
          }

          this.scrollSubscription = fromEvent(window, 'scroll').subscribe(
            () => {
              this.scrollPositionService.saveScrollPosition(
                urlAfterRedirects,
                window.scrollY
              );
            }
          );
        });
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
