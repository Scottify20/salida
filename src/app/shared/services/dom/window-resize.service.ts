import { Injectable } from '@angular/core';
import { fromEvent, Observable, BehaviorSubject, Subject } from 'rxjs';
import {
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
export class WindowResizeService {
  constructor(private platformCheck: PlatformCheckService) {
    if (this.platformCheck.isBrowser()) {
      fromEvent(window, 'resize')
        .pipe(
          throttleTime(15),
          map(() => ({ width: window.innerWidth, height: window.innerHeight })),
          distinctUntilChanged(
            (prev, curr) =>
              prev.width === curr.width && prev.height === curr.height,
          ),
          shareReplay(1),
        )
        .subscribe(() => {
          this.emitResizeEvent();
        });
    }
  }

  private resizeSubject = new Subject<{ width: number; height: number }>();
  private isResizingSubject = new BehaviorSubject<boolean>(false);
  private resizeTimer: any;

  // Combined observable for window dimensions and resizing state
  windowResizeState$: Observable<WindowResizeState> = this.resizeSubject
    .asObservable()
    .pipe(
      startWith(
        this.platformCheck.isBrowser()
          ? { width: window.innerWidth, height: window.innerHeight }
          : { width: 0, height: 0 },
      ),
      map((dimensions) => ({
        dimensions,
        isResizing: this.isResizingSubject.value,
      })),
      distinctUntilChanged(
        (prev, curr) =>
          prev.dimensions.width === curr.dimensions.width &&
          prev.dimensions.height === curr.dimensions.height &&
          prev.isResizing === curr.isResizing,
      ),
      shareReplay(1),
    );

  private emitResizeEvent() {
    if (this.platformCheck.isBrowser()) {
      this.isResizingSubject.next(true);

      clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(() => {
        const newDimensions = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        this.resizeSubject.next(newDimensions);
        this.isResizingSubject.next(false);
      }, 0);
    }
  }

  triggerResize() {
    this.emitResizeEvent();
  }

  isResizing() {
    if (this.platformCheck.isBrowser()) {
      this.isResizingSubject.next(true);

      clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(() => {
        this.resizeSubject.next({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        this.isResizingSubject.next(false);
      }, 15);
    }
  }
}

// Interface for the window resize state
export interface WindowResizeState {
  dimensions: { width: number; height: number };
  isResizing: boolean;
}
