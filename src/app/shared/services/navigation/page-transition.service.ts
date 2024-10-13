import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, tap } from 'rxjs';
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
  appElement!: HTMLElement;
  previousRouteSig = this.routeHistoryService.previousRouteSig;
  newRouteSig = this.routeHistoryService.newRouteSig;

  setElements() {
    this.mainElement = this.document.getElementById(
      'main-element',
    ) as HTMLElement;

    this.appElement = this.document.querySelector('app-root') as HTMLElement;
  }

  startPageTransitions() {
    this.setElements();

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
    this.clearTransitionsAnimations();

    const previousUrl = this.previousRouteSig();
    if (!previousUrl) {
      return;
    }

    const previousUrlSplitted = previousUrl.split('/');
    const currentUrlSplitted = this.newRouteSig().split('/');

    const previousLength = previousUrlSplitted.length;
    const currentLength = currentUrlSplitted.length;

    // if the route length of previous is shorter than the current url (went to a deeper route)
    if (previousLength < currentLength) {
      this.triggerSlideFromRightTransition();
      return;
    }

    // if the route length of previous is longer than the current url (go back to a shallower route)
    if (previousLength > currentLength) {
      this.triggerSlideFromLeftTransition();
      return;
    }

    if (previousLength === currentLength) {
      if (previousUrlSplitted[-1] !== currentUrlSplitted[-1]) {
        this.triggerSlideFromRightTransition();
        return;
      } else {
        this.triggerFadeOutAndInTransititon();
        return;
      }
    }
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
    this.appElement.style.overflow = 'hidden';
    this.appElement.style.display = 'block';
    this.mainElement.classList.add('slide-in-from-left');
    // Remove class after animation ends
    this.mainElement.onanimationend = () => {
      this.mainElement.classList.remove('slide-in-from-left');
      this.appElement.style.display = 'unset';
      this.appElement.style.overflow = 'auto';
    };
  }

  triggerSlideFromRightTransition() {
    this.appElement.style.overflow = 'hidden';
    this.appElement.style.display = 'block';
    this.mainElement.classList.add('slide-in-from-right');
    // Remove class after animation ends
    this.mainElement.onanimationend = () => {
      this.mainElement.classList.remove('slide-in-from-right');
      this.appElement.style.display = 'unset';
      this.appElement.style.overflow = 'auto';
    };
  }
}
