import { Injectable } from '@angular/core';
import {
  fromEvent,
  Observable,
  BehaviorSubject,
  Subscription,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  throttleTime,
} from 'rxjs/operators';
import { PlatformCheckService } from './platform-check.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollDetectorService {
  private scrollSubject = new Subject<{
    scrollTop: number;
    scrollLeft: number;
  }>();
  private isScrollingSubject = new BehaviorSubject<boolean>(false);
  private scrollTimer: any;

  // Combined observable for scroll position and scrolling state
  windowScrollState$: Observable<WindowScrollState> = this.scrollSubject
    .asObservable()
    .pipe(
      startWith(
        this.platformCheck.isBrowser()
          ? {
              scrollTop: window.scrollY || document.documentElement.scrollTop,
              scrollLeft: window.screenX || document.documentElement.scrollLeft,
            }
          : { scrollTop: 0, scrollLeft: 0 },
      ),
      map((position) => ({
        position,
        isScrolling: this.isScrollingSubject.value,
      })),
      distinctUntilChanged(
        (prev, curr) =>
          prev.position.scrollTop === curr.position.scrollTop &&
          prev.position.scrollLeft === curr.position.scrollLeft &&
          prev.isScrolling === curr.isScrolling,
      ),
      shareReplay(1),
    );

  private _subscriptions: Subscription[] = []; // To store all subscriptions

  constructor(private platformCheck: PlatformCheckService) {
    if (this.platformCheck.isBrowser()) {
      const subscription = fromEvent(window, 'scroll')
        .pipe(
          throttleTime(15),
          map(() => ({
            scrollTop: window.scrollY || document.documentElement.scrollTop,
            scrollLeft: window.scrollX || document.documentElement.scrollLeft,
          })),
          distinctUntilChanged(
            (prev, curr) =>
              prev.scrollTop === curr.scrollTop &&
              prev.scrollLeft === curr.scrollLeft,
          ),
          shareReplay(1),
        )
        .subscribe(() => {
          this.emitScrollEvent();
        });

      this._subscriptions.push(subscription);
    }
  }

  private emitScrollEvent() {
    if (this.platformCheck.isBrowser()) {
      this.isScrollingSubject.next(true);

      clearTimeout(this.scrollTimer);

      this.scrollTimer = setTimeout(() => {
        const newScrollPosition = {
          scrollTop: window.scrollY || document.documentElement.scrollTop,
          scrollLeft: window.scrollX || document.documentElement.scrollLeft,
        };
        this.scrollSubject.next(newScrollPosition);
        this.isScrollingSubject.next(false);
      }, 0);
    }
  }

  triggerScroll() {
    this.emitScrollEvent();
  }

  isScrolling() {
    if (this.platformCheck.isBrowser()) {
      this.isScrollingSubject.next(true);

      clearTimeout(this.scrollTimer);

      this.scrollTimer = setTimeout(() => {
        this.scrollSubject.next({
          scrollTop: window.scrollY || document.documentElement.scrollTop,
          scrollLeft: window.scrollX || document.documentElement.scrollLeft,
        });
        this.isScrollingSubject.next(false);
      }, 15);
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

export interface WindowScrollState {
  position: { scrollTop: number; scrollLeft: number };
  isScrolling: boolean;
}
