import { Injectable } from '@angular/core';
import {
  fromEvent,
  Observable,
  Subject,
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
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

  private resizeSubject = new Subject<{ width: number; height: number }>();
  windowDimensions$: Observable<{ width: number; height: number }> =
    this.resizeSubject
      .asObservable()
      .pipe(
        startWith(
          this.platformCheck.isBrowser()
            ? { width: window.innerWidth, height: window.innerHeight }
            : { width: 0, height: 0 }
        )
      );

  private isResizingSubject = new BehaviorSubject<boolean>(false);
  isResizing$ = this.isResizingSubject.asObservable();
  private resizeTimer: any;

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
      }, 250);
    }
  }
}

export interface WindowResizeServiceUser {
  isResizing: boolean;
  windowDimensions: { width: number; height: number };

  _resizeSubscription: Subscription;
  _isResizingSubscription: Subscription;

  ngOnInit(): void;
  ngOnDestroy(): void;
}

// components using this service must have these properties and methods

/*{

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };
  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;

  ngOnInit() {
    this._resizeSubscription =
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this._isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });
    this.windowResizeService.isResizing();
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._isResizingSubscription.unsubscribe();
  }

} */
