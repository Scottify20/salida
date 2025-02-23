import { ElementRef, Injectable, inject } from '@angular/core';
import { WindowResizeService } from './window-resize.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PlatformCheckService } from './platform-check.service';
import { ScrollDetectorService } from './scroll-detector.service';

@Injectable({
  providedIn: 'root',
})
export class ElementPositionService {
  private platformCheckService = inject(PlatformCheckService);
  private windowResizeService = inject(WindowResizeService);
  private scrollDectectorService = inject(ScrollDetectorService);

  private _resizeSubscription!: Subscription;
  private _scrollSubscription!: Subscription;
  private _subscriptions: Subscription[] = [];

  private manualUpdateSubject = new Subject<void>();

  private trackedElements: {
    [key: string]: {
      elementRef: ElementRef;
      subscriptions: Subscription[];
      position$: BehaviorSubject<DOMRect>;
    };
  } = {};

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  constructor() {
    // Subscribe to the combined windowResizeState$ observable and store the subscription
    this._resizeSubscription =
      this.windowResizeService.windowResizeState$.subscribe((state) => {
        this.isResizing = state.isResizing;
        this.windowDimensions = state.dimensions;
        this.updateElementPositions();
      });

    // Subscribe to windowScrollState$ to trigger updates on scroll
    this._scrollSubscription =
      this.scrollDectectorService.windowScrollState$.subscribe(() => {
        this.updateElementPositions();
      });

    this._subscriptions.push(
      this.manualUpdateSubject.subscribe(() => {
        this.updateElementPositions();
      }),
    );
  }

  getElementRefById(id: string): ElementRef | null {
    if (this.platformCheckService.isBrowser()) {
      const element = document.getElementById(id);

      if (!element) {
        console.log(
          `Element with id: ${id}  not found, check if the id is correct.`,
        );
        return null;
      }
      return new ElementRef(element);
    }
    return null;
  }

  trackElementPosition$(
    key: string,
    elementRef: ElementRef,
  ): Observable<DOMRect> {
    this.untrackElementPosition(key);

    const position$ = new BehaviorSubject<DOMRect>(
      elementRef.nativeElement.getBoundingClientRect(),
    );

    // Subscribe to windowResizeState$ instead of windowDimensions$
    const subscription = this.windowResizeService.windowResizeState$.subscribe(
      () => {
        this.updateElementPosition(key);
      },
    );

    this._subscriptions.push(subscription);
    this.trackedElements[key] = {
      elementRef,
      subscriptions: [subscription],
      position$,
    };

    return position$.asObservable();
  }

  triggerManualUpdate() {
    this.manualUpdateSubject.next();
  }

  private updateElementPositions(): void {
    for (const key in this.trackedElements) {
      this.updateElementPosition(key);
    }
  }

  private updateElementPosition(key: string): void {
    if (!this.trackedElements[key]) {
      return; // Skip if the element has been untracked
    }

    const elementRef = this.trackedElements[key].elementRef;
    const position$ = this.trackedElements[key].position$;
    const element = elementRef.nativeElement;
    const position = element.getBoundingClientRect();
    position$.next(position);
  }

  untrackElementPosition(key: string): void {
    if (this.trackedElements[key]) {
      this.trackedElements[key].subscriptions.forEach((subscription) =>
        subscription.unsubscribe(),
      );
      this.trackedElements[key].position$.complete();
      delete this.trackedElements[key];
    }
  }

  ngOnDestroy(): void {
    this._resizeSubscription?.unsubscribe();
    this._scrollSubscription?.unsubscribe();
    this.manualUpdateSubject.unsubscribe();
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    for (const key in this.trackedElements) {
      this.untrackElementPosition(key);
    }
  }
}

export interface ElementPositionServiceUser {
  elementPosition$: Observable<DOMRect>;
  ngOninit(): void;
  ngOnDestroy(): void;
}
