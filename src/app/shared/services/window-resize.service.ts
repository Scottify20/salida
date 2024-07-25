import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { fromEvent, Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WindowResizeService {
  private resizeSubject = new Subject<{ width: number; height: number }>();
  windowDimensions$: Observable<{ width: number; height: number }> =
    this.resizeSubject
      .asObservable()
      .pipe(
        startWith(
          isPlatformBrowser(this.platformId)
            ? { width: window.innerWidth, height: window.innerHeight }
            : { width: 0, height: 0 }
        )
      );

  private isResizingSubject = new BehaviorSubject<boolean>(false);
  isResizing$ = this.isResizingSubject.asObservable();

  private resizeTimer: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(250),
          map(() => ({ width: window.innerWidth, height: window.innerHeight })),
          distinctUntilChanged(
            (prev, curr) =>
              prev.width === curr.width && prev.height === curr.height
          ),
          shareReplay(1)
        )
        .subscribe(this.resizeSubject);
    }
  }

  isResizing() {
    if (isPlatformBrowser(this.platformId)) {
      this.isResizingSubject.next(true);
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resizeSubject.next({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        this.isResizingSubject.next(false);
      }, 250);
    }
  }
}
