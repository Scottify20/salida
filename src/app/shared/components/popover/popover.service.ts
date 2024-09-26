import { Injectable, ElementRef, Inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

// Import your custom services for element position tracking and scroll disabling
import { ElementPositionService } from '../../services/dom/element-position.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { PopoverConfig, PopoverItem } from './popover.model';

@Injectable()
export class PopoverService {
  private document: Document;
  private elementTrackingSubscription: Subscription | null = null;
  private anchorElementClickSubscription: Subscription | null = null;
  private clickedOutsidePopoverSubscription: Subscription | null = null;

  constructor(
    private elementPositionService: ElementPositionService,
    private scrollDisablerService: ScrollDisablerService,
    @Inject(DOCUMENT) document: Document,
  ) {
    this.document = document;
  }

  // Method to open the popover
  openPopover(
    popoverConfig: PopoverConfig,
    popoverSectionsContainer: ElementRef,
    isOpen: { value: boolean },
  ) {
    this.trackAnchorElement(popoverConfig, popoverSectionsContainer, isOpen);
    this.scrollDisablerService.disableBodyScroll(popoverConfig.popoverId);
    isOpen.value = true;
  }

  // Method to close the popover
  closePopover(popoverConfig: PopoverConfig, isOpen: { value: boolean }) {
    this.scrollDisablerService.enableBodyScroll(popoverConfig.popoverId);
    this.untrackAnchorElement(popoverConfig);
    this.unsubscribeSubscriptions();
    isOpen.value = false;
  }

  // Method to start listening for clicks on the anchor element
  listenToAnchorClicks(
    anchorElement: HTMLElement,
    popoverConfig: PopoverConfig,
    isOpen: { value: boolean },
    popoverSectionsContainer: ElementRef, // Pass the reference here!
  ) {
    this.anchorElementClickSubscription = fromEvent(anchorElement, 'click')
      .pipe(
        tap(() => {
          isOpen.value = !isOpen.value;

          if (isOpen.value) {
            this.openPopover(popoverConfig, popoverSectionsContainer, isOpen); // Pass to openPopover
          } else {
            this.closePopover(popoverConfig, isOpen);
          }
        }),
      )
      .subscribe();
  }

  // Method to track the anchor element's position
  private trackAnchorElement(
    popoverConfig: PopoverConfig,
    popoverSectionsContainer: ElementRef,
    isOpen: { value: boolean },
  ) {
    const anchorElementId = popoverConfig.anchoringConfig.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      console.error(
        'Anchor element not found! Popover might not work as expected.',
      );
      return; // Exit if anchor element is not found
    }

    const popover = popoverSectionsContainer.nativeElement as HTMLDivElement;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    // Subscribe to changes in the anchor element's position
    this.elementTrackingSubscription = this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        tap((domrect) => {
          const popoverPositioning = popoverConfig.anchoringConfig.position;

          // Position the popover based on the configured position
          switch (popoverPositioning) {
            case 'bottom-end':
              popover.style.left = `${domrect.left - popoverWidth + domrect.width}px`;
              popover.style.top = `${Math.abs(domrect.top) + domrect.height + 8}px`;
              break;
            // Add cases for other positions (e.g., 'bottom-start', 'top-left', etc.)
            default:
              console.warn(
                `Popover position of ${popoverPositioning} is not handled yet!`,
              );
          }
        }),
      )
      .subscribe();

    // Subscribe to outside clicks after positioning the popover
    this.subscribeToOutsideClicks(
      popoverSectionsContainer.nativeElement,
      anchorElementRef.nativeElement,
      isOpen,
      popoverConfig,
    );
  }

  // Method to subscribe to click events outside of the popover
  private subscribeToOutsideClicks(
    popoverElement: HTMLElement,
    anchorElement: HTMLElement,
    isOpen: { value: boolean },
    popoverConfig: PopoverConfig,
  ) {
    this.clickedOutsidePopoverSubscription = fromEvent(this.document, 'click')
      .pipe(
        tap((e) => {
          if (
            isOpen.value &&
            e.target !== popoverElement &&
            e.target !== anchorElement
          ) {
            this.closePopover(popoverConfig, isOpen);
          }
        }),
      )
      .subscribe();
  }

  // Method to stop tracking the anchor element's position
  private untrackAnchorElement(popoverConfig: PopoverConfig) {
    this.elementTrackingSubscription?.unsubscribe();
    this.elementPositionService.untrackElementPosition(
      popoverConfig.anchoringConfig.anchorElementId,
    );
  }

  // Method to unsubscribe from all subscriptions
  private unsubscribeSubscriptions() {
    this.elementTrackingSubscription?.unsubscribe();
    this.clickedOutsidePopoverSubscription?.unsubscribe();
    this.anchorElementClickSubscription?.unsubscribe();
  }
}
