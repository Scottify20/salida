import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PlatformCheckService } from '../dom/platform-check.service';
import { ScrollDetectorService } from '../dom/scroll-detector.service';
import { RouteHistoryService } from './route-history.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteScrollPositionService {
  readonly scrollPostionRegexUrlWhitelist: string[] = [
    '/',
    '/lists',
    '/search',
  ];
  scrollPositions: { [key: string]: number } = {};

  readonly scrollRestoreUrlRegexBlacklist: RegExp[] = [
    /^\/series\/[\d-]+.+?\/.+$/,
    /^\/movie\/[\d-]+.+?\/.+$/,
  ];

  constructor(
    private router: Router,
    private platFormCheckService: PlatformCheckService,
    private scrollDetectorService: ScrollDetectorService,
  ) {
    if (this.platFormCheckService.isServer()) {
      return;
    }
    this.startSavingAndInterceptingScrollPositions();
  }

  startSavingAndInterceptingScrollPositions() {
    this.scrollDetectorService.windowScrollState$
      .pipe(
        tap((scrollState) => {
          // save the scroll positon of the page
          this.saveScrollPosition(this.router.url);
        }),
      )
      .subscribe();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // when on the page to visit
        this.handleNavigationEnd(event.urlAfterRedirects);
      }
    });
  }

  saveScrollPosition(url: string) {
    if (this.isUrlInWhitelist(url)) {
      setTimeout(() => {
        this.scrollPositions[url] = window.scrollY;
      }, 0);
    }
  }

  handleNavigationEnd(url: string) {
    if (this.isUrlInWhitelist(url)) {
      setTimeout(() => {
        window.scrollTo({
          top: this.scrollPositions[url],
        });
      }, 0);
    }

    if (
      !this.isUrlInWhitelist(url) &&
      this.scrollRestoreUrlRegexBlacklist.some((urlRegex) => urlRegex.test(url))
    ) {
      // do not modify scroll position
      return;
    }

    if (!this.isUrlInWhitelist(url)) {
      window.scrollTo({ top: 0 });
      return;
    }
  }

  isUrlInWhitelist(url: string) {
    return this.scrollPostionRegexUrlWhitelist.some((urlInWhitelist) => {
      return urlInWhitelist === url;
    });
  }

  resetAllScrollPositions() {
    this.scrollPositions = {};
  }
}
