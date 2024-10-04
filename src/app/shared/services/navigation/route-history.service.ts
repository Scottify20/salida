import { Inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PlatformCheckService } from '../dom/platform-check.service';
import { DOCUMENT } from '@angular/common';
import { throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteHistoryService {
  readonly urlRegexesToSkip: RegExp[] = [
    /^\/series\/[\d-]+.+?\/(seasons|reviews)$/,
    /^\/movie\/[\d-]+.+?\/(releases|reviews)$/,
  ];
  savedUrls: string[] = ['/'];

  isPopStateNavigation = false; // Flag for popstate event

  constructor(
    private router: Router,
    private platFormCheckService: PlatformCheckService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if (this.platFormCheckService.isServer()) {
      return;
    }
    this.startSavingAndInterceptingRoutes();
  }

  previousRouteSig = signal('');
  currentRouteSig = signal('');

  setPreviousAndCurrentRoute(currentUrl: string) {
    this.previousRouteSig.set(this.currentRouteSig() || '/');
    this.currentRouteSig.set(currentUrl);
  }

  startSavingAndInterceptingRoutes() {
    // Detect popstate (back/forward) events

    window.addEventListener('popstate', () => {
      this.isPopStateNavigation = true;

      // I added this to remove the flicker when navigating with back and forward buttons/gestures
      this.navigateToLastSavedUrl();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.handleNavigationStart(event.url);
      }

      if (event instanceof NavigationEnd) {
        this.setPreviousAndCurrentRoute(event.url);

        // Reset the flag AFTER handling NavigationStart
        this.isPopStateNavigation = false;

        this.handleNavigationEnd(event.urlAfterRedirects);
      }
    });
  }

  handleNavigationStart(url: string) {
    // Intercept ONLY if it's a popstate (back/forward) navigation
    if (this.urlIsInTheSkipList(url) && this.isPopStateNavigation) {
      this.navigateToLastSavedUrl(url);
      return;
    }
  }

  handleNavigationEnd(url: string) {
    // checks if the url is in the urls to skip array;
    // or is already the last entry in the savedUrls
    // and if the user navigated with backward and forward button/gesture
    // return if true and skip adding to savedUrls
    if (
      this.urlIsInTheSkipList(url) ||
      url === this.savedUrls[this.savedUrls.length - 1]
    ) {
      return;
    }

    // or push the url to saved urls if not
    this.savedUrls.push(url);
  }

  navigateToLastSavedUrl(url?: string) {
    const lastSavedUrl = this.savedUrls[-1] || '/';
    this.router.navigateByUrl(lastSavedUrl);
  }

  urlIsInTheSkipList(url: string) {
    return this.urlRegexesToSkip.some((urlRegexToSkip) => {
      return urlRegexToSkip.test(url);
    });
  }
}
