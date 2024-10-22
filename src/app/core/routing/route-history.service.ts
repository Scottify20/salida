import { Injectable, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteHistoryService {
  constructor(private router: Router) {}

  previousRouteSig: WritableSignal<string | null> = signal('/');
  newRouteSig = signal('/');

  setPreviousAndCurrentRoute(newUrl: string) {
    this.previousRouteSig.set(this.newRouteSig() || '/');
    this.newRouteSig.set(newUrl);
  }

  startSavingAndInterceptingRoutes() {
    // Detect popstate (back/forward) events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // this.handleNavigationStart(event.url);
      }
      if (event instanceof NavigationEnd) {
        this.setPreviousAndCurrentRoute(event.url);
      }
    });
  }
}
