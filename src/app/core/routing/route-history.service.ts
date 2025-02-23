import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteHistoryService {
  private router = inject(Router);


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
