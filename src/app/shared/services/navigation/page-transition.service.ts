import { Inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, tap, throttleTime } from 'rxjs';
import { RouteHistoryService } from './route-history.service';

@Injectable({
  providedIn: 'root',
})
export class PageTransitionService {
  constructor(
    private router: Router,
    private routeHistoryService: RouteHistoryService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  mainElement!: HTMLElement;
  previousRouteSig = this.routeHistoryService.previousRouteSig;
  currentRouteSig = this.routeHistoryService.currentRouteSig;

  readonly urlRegexesToSkipOnSlideTransition: RegExp[] = [
    /^\/series\/[\d-]+.+?\/(seasons|reviews)$/,
    /^\/movie\/[\d-]+.+?\/(releases|reviews)$/,
  ];

  readonly urlRegexesToSkipOnFadeTransition: RegExp[] = [
    /^\/series\/[\d-]+.+?\/details$/,
    /^\/movie\/[\d-]+.+?\/details$/,
  ];

  setMainElement() {
    this.mainElement = this.document.getElementById(
      'main-element',
    ) as HTMLElement;
  }

  startPageTransitions() {
    this.setMainElement();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: any) => {
          this.setTransitionAnimation();
        }),
      )
      .subscribe();
  }

  setTransitionAnimation() {
    // if the route is in the skip list for slide transition
    if (this.urlIsInSlideTransitionSkipList(this.router.url)) {
      return;
    }

    // if the site is first viewed on the root route
    if (this.previousRouteSig() === '/' && this.currentRouteSig() === '/') {
      return;
    }

    this.clearTransitionsAnimations();

    const previousUrlSplitted = this.previousRouteSig().split('/');
    const currentUrlSplitted = this.currentRouteSig().split('/');

    const previousLength = previousUrlSplitted.length;
    const currentLength = currentUrlSplitted.length;

    // if the route length of previous is shorter than the current url (went to a deeper route)
    if (previousLength < currentLength) {
      this.triggerSlideFromRightTransition();
    }

    // if the route length of previous is longer than the current url (go back to a shallower route)
    if (previousLength > currentLength) {
      this.triggerSlideFromLeftTransition();
    }

    if (
      previousLength === currentLength &&
      !this.urlIsInFadeTransitionSkipList(this.router.url)
    ) {
      console.log(previousUrlSplitted[2], currentUrlSplitted[2]);
      if (
        currentUrlSplitted[2] !== undefined &&
        currentUrlSplitted[2].length >= 2
        // && previousUrlSplitted[2] === currentUrlSplitted[2]
      ) {
        this.triggerSlideFromRightTransition();
        return;
      }

      this.triggerFadeOutAndInTransititon();
    }
  }

  urlIsInSlideTransitionSkipList(url: string) {
    return this.urlRegexesToSkipOnSlideTransition.some((urlRegexToSkip) => {
      return urlRegexToSkip.test(url);
    });
  }

  urlIsInFadeTransitionSkipList(url: string) {
    return this.urlRegexesToSkipOnFadeTransition.some((urlRegexToSkip) => {
      return urlRegexToSkip.test(url);
    });
  }

  clearTransitionsAnimations() {
    this.mainElement.classList.remove('slide-in-from-right');
    this.mainElement.classList.remove('slide-in-from-left');
    this.mainElement.classList.remove('fade-in');
  }

  triggerFadeOutAndInTransititon() {
    this.mainElement.classList.add('fade-in');

    // Remove class after animation ends
    this.mainElement.onanimationend = () => {
      this.mainElement.classList.remove('fade-in');
    };
  }

  triggerSlideFromLeftTransition() {
    this.mainElement.classList.add('slide-in-from-left');

    this.mainElement.onanimationend = () => {
      this.mainElement.classList.remove('slide-in-from-left');
    };
  }

  triggerSlideFromRightTransition() {
    this.mainElement.classList.add('slide-in-from-right');

    // Remove class after animation ends
    this.mainElement.onanimationend = () => {
      this.mainElement.classList.remove('slide-in-from-right');
    };
  }
}
