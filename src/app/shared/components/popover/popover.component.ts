import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription, tap } from 'rxjs';

import { PopoverConfig, PopoverItem } from './popover.model';
import { ElementPositionService } from '../../services/dom/element-position.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  // Inject services
  private elementPositionService = inject(ElementPositionService);
  private scrollDisablerService = inject(ScrollDisablerService);
  private document = inject(DOCUMENT);

  // Input property for popover configuration
  @Input() popoverConfig: PopoverConfig = {
    popoverId: '',
    anchoringConfig: {
      anchorElementId: '',
      position: 'bottom',
    },
    layout: 'list',
    itemSectionsConfig: [],
    backdrop: 'none',
  };

  // View child references
  @ViewChild('popoverSectionsContainer')
  popoverSectionsContainer!: ElementRef;
  @ViewChild('popoverArrow') popoverArrow!: ElementRef;

  // Signal to track popover open/close state
  isOpenSig = signal(false);

  // Subscriptions are now initialized directly
  private elementTrackingSubscription: Subscription | null = null;
  private anchorElementClickSubscription: Subscription | null = null;
  private clickedOutsidePopoverSubscription: Subscription | null = null;

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.cleanupSubscriptionsAndClosePopover();
  }

  private closePopover() {
    this.scrollDisablerService.enableBodyScroll(this.popoverConfig.popoverId);
    this.isOpenSig.set(false);
  }

  private openPopover() {
    this.trackAnchorElement();
    this.scrollDisablerService.disableBodyScroll(this.popoverConfig.popoverId);
  }

  // --- Helper Methods ---

  private setupEventListeners() {
    const popoverElement = this.popoverSectionsContainer.nativeElement;
    const anchorElement = this.getAnchorElement();

    if (!anchorElement) {
      return;
    }

    this.anchorElementClickSubscription =
      this.subscribeToAnchorClick(anchorElement);
    this.clickedOutsidePopoverSubscription = this.subscribeToOutsideClick(
      popoverElement,
      anchorElement,
    );
  }

  private cleanupSubscriptionsAndClosePopover() {
    this.closePopover();
    this.untrackAnchorElement();

    this.anchorElementClickSubscription?.unsubscribe();
    this.clickedOutsidePopoverSubscription?.unsubscribe();
    this.elementTrackingSubscription?.unsubscribe();
  }

  // --- Element Tracking ---

  private trackAnchorElement() {
    const anchorElementId = this.popoverConfig.anchoringConfig.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      return;
    }

    this.elementTrackingSubscription = this.subscribeToAnchorPositionChanges(
      anchorElementId,
      anchorElementRef,
    );
  }

  private untrackAnchorElement() {
    this.elementTrackingSubscription?.unsubscribe();
    this.elementPositionService.untrackElementPosition(
      this.popoverConfig.anchoringConfig.anchorElementId,
    );
  }

  // --- Event Subscription Logic ---

  private subscribeToAnchorClick(anchorElement: HTMLElement): Subscription {
    return fromEvent(anchorElement, 'click')
      .pipe(
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
  ): Subscription {
    return fromEvent(this.document, 'click')
      .pipe(
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
  ): Subscription {
    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    return this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        tap((domrect) => {
          const popoverPositioning =
            this.popoverConfig.anchoringConfig.position;
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
      this.popoverConfig.anchoringConfig.anchorElementId,
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

    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;
    popover.style.left = domrect.left - popoverWidth + domrect.width + 'px';
    popover.style.top = domrect.top + domrect.height + 8 + 'px';
  }

  getItemText(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
  }

  // Checks if a popover item should be visible based on its 'isVisibleIf' condition
  itemIsVisible(item: PopoverItem): boolean {
    return !item.isVisibleIf || item.isVisibleIf() ? true : false;
  }

  // Determines the active class for a popover item based on its 'isActive' condition
  isActiveClass(isActiveCallback: (() => boolean) | undefined): string {
    return !isActiveCallback || isActiveCallback() ? 'active' : '';
  }
}
