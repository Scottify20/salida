import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  Input,
  signal,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { fromEvent, tap } from 'rxjs';

import { PopoverProps } from './popover.interface';
import { ElementPositionService } from '../../services/dom/element-position.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-popover',
    imports: [CommonModule],
    templateUrl: './popover.component.html',
    styleUrl: './popover.component.scss'
})
export class PopoverComponent {
  // Inject services
  constructor(
    private destroyRef: DestroyRef,
    private router: Router,
    private elementPositionService: ElementPositionService,
    private scrollDisablerService: ScrollDisablerService,
    @Inject(DOCUMENT) private document: Document,
    private appRef: ApplicationRef,
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.closePopover();
          }
        }),
      )
      .subscribe();
  }

  // Input property for popover configuration
  @Input() popoverProps: PopoverProps = {
    popoverId: '',
    anchorElementId: '',
    position: 'bottom-end',
    backdrop: 'none',
    childComponentsProps: {},
    childComponentType: {},
  };

  // Signal to track popover open/close state
  isOpenSig = signal(false);
  // offset style properties for the popover
  topOffset = 0;
  leftOffset = 0;

  // View child references
  @ViewChild('popoverArrow') popoverArrow!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.stopTrackingAndClosePopover();
  }

  private closePopover() {
    this.scrollDisablerService.enableBodyScroll(this.popoverProps.popoverId);
    this.isOpenSig.set(false);
  }

  private openPopover() {
    this.trackAnchorElement();

    this.appendComponentToBody();

    this.scrollDisablerService.disableBodyScroll(this.popoverProps.popoverId);
  }

  appendComponentToBody() {
    const componentFactory = this.dynamicComponentContainer.createComponent(
      this.popoverProps.childComponentType as Type<any>,
    );

    Object.assign(
      componentFactory.instance,
      this.popoverProps.childComponentsProps,
    );

    const componentRootElement = componentFactory.location
      .nativeElement as HTMLElement;

    // Check if the view is attached
    if ((componentFactory.hostView as any)._viewContainerRef) {
      this.appRef.detachView(componentFactory.hostView);
    }

    this.dynamicComponentContainer.clear(); // Still a good practice

    this.appRef.attachView(componentFactory.hostView);
    document.body.appendChild(componentRootElement);
  }

  // --- Helper Methods ---
  private setupEventListeners() {
    const popoverElement = this.popover.nativeElement;
    const anchorElement = this.getAnchorElement();

    if (!anchorElement) {
      return;
    }

    this.subscribeToAnchorClick(anchorElement);
    this.subscribeToOutsideClick(popoverElement, anchorElement);
  }

  private stopTrackingAndClosePopover() {
    this.closePopover();
    this.untrackAnchorElement();
  }

  // --- Element Tracking ---
  private trackAnchorElement() {
    const anchorElementId = this.popoverProps.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      return;
    }

    this.subscribeToAnchorPositionChanges(anchorElementId, anchorElementRef);
  }

  private untrackAnchorElement() {
    this.elementPositionService.untrackElementPosition(
      this.popoverProps.anchorElementId,
    );
  }

  // --- Event Subscriptions ---
  private subscribeToAnchorClick(anchorElement: HTMLElement) {
    fromEvent(anchorElement, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.isOpenSig.set(!this.isOpenSig());
          this.isOpenSig() ? this.openPopover() : this.closePopover();
        }),
      )
      .subscribe();
  }

  private subscribeToOutsideClick(
    popoverElement: HTMLElement,
    anchorElement: HTMLElement,
  ) {
    fromEvent(this.document, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((e) => {
          if (
            this.isOpenSig() &&
            e.target !== popoverElement &&
            e.target !== anchorElement
          ) {
            this.closePopover();
          }
        }),
      )
      .subscribe();
  }

  private subscribeToAnchorPositionChanges(
    anchorElementId: string,
    anchorElementRef: ElementRef,
  ) {
    const popover = this.popover.nativeElement as HTMLDivElement;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((domrect) => {
          const popoverPositioning = this.popoverProps.position;
          this.updatePopoverPosition(
            popoverPositioning,
            domrect,
            popoverWidth,
            popoverHeight,
          );
        }),
      )
      .subscribe();
  }

  // --- Utility Methods ---
  private getAnchorElement(): HTMLElement | undefined {
    return this.elementPositionService.getElementRefById(
      this.popoverProps.anchorElementId,
    )?.nativeElement as HTMLElement;
  }

  private updatePopoverPosition(
    popoverPositioning: string,
    domrect: DOMRect,
    popoverWidth: number,
    popoverHeight: number,
  ): void {
    if (popoverPositioning !== 'bottom-end') {
      console.log(
        `Popover position of ${popoverPositioning} is not handled yet!`,
      );
      return;
    }

    this.leftOffset = domrect.left - popoverWidth + domrect.width;
    this.topOffset = domrect.top + domrect.height + 16;
  }
}
