import { ElementRef, Injectable } from '@angular/core';
import {
  WindowResizeService,
  WindowResizeServiceUser,
} from './window-resize.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PlatformCheckService } from './platform-check.service';

@Injectable({
  providedIn: 'root',
})
export class ElementPositionService {
  constructor(
    private platformCheckService: PlatformCheckService,
    private windowResizeService: WindowResizeService
  ) {
    this.windowResizeService.windowDimensions$.subscribe(() => {
      this.updateElementPositions();
    });
  }

  private trackedElements: {
    [key: string]: {
      elementRef: ElementRef;
      subscriptions: Subscription[];
      position$: BehaviorSubject<DOMRect>;
    };
  } = {};

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };
  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;

  getElementRefById(id: string): ElementRef | null {
    if (this.platformCheckService.isBrowser()) {
      const element = document.getElementById(id);
      if (element) {
        return new ElementRef(element);
      }
    }
    return null;
  }

  trackElementPosition(
    key: string,
    elementRef: ElementRef
  ): Observable<DOMRect> {
    this.untrackElementPosition(key);

    const subscriptions: Subscription[] = [];
    const position$ = new BehaviorSubject<DOMRect>(
      elementRef.nativeElement.getBoundingClientRect()
    );

    subscriptions.push(
      this.windowResizeService.windowDimensions$.subscribe(() => {
        this.updateElementPosition(key);
      })
    );

    this.trackedElements[key] = { elementRef, subscriptions, position$ };

    return position$.asObservable();
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
        subscription.unsubscribe()
      );
      this.trackedElements[key].position$.complete();
      delete this.trackedElements[key];
    }
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this._resizeSubscription?.unsubscribe();
    this._isResizingSubscription?.unsubscribe();

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

/*
  constructor(private elementPositionService: ElementPositionService) {}

  ngOnInit() {
    this.elementPosition$ = this.elementPositionService.trackElementPosition('myElementKey', this.myElementRef);

    this.elementPosition$.subscribe(position => {
      console.log('Element position:', position);
    });
  }

  ngOnDestroy() {
    this.elementPositionService.untrackElementPosition('myElementKey');
  }

*/
