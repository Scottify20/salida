import { Component, computed, DestroyRef, ElementRef, Input, signal, Signal, ViewChild, inject } from '@angular/core';
import { ElementPositionService } from '../../services/dom/element-position.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { DOCUMENT } from '@angular/common';
import { fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface PopoverMenuProps {
  popoverId: string;
  anchoringConfig: {
    onOutsideClickCallback?: () => void;
    anchorElementId: string;
    position:
      | 'bottom'
      | 'top'
      | 'left'
      | 'right'
      | 'bottom-start'
      | 'bottom-end'
      | 'top-start'
      | 'top-end'
      | 'right-start'
      | 'right-end'
      | 'left-start'
      | 'left-end';
  };
  backdrop: 'mobile-only' | 'always' | 'none';
  itemGroupsConfig: {
    groups: ItemsGroup[];
    highlightSelectedItem?: boolean;
  };
}

interface ItemsGroup {
  contentType: 'icon' | 'icon-and-text' | 'text';
  sectionName: string;
  items: MenuItem[];
}

export interface MenuItem {
  iconPath?: string;
  text?: string | Signal<string | null | undefined> | (() => string);
  isActive?: () => boolean; // refer to the isActiveClass() method on the end of this component's class
  isVisibleIf?: () => boolean | Signal<boolean | null | undefined>; // shows the item if true, hide otherwise // always show if this fn is not defined
  onClickCallback?: () => void;
}

@Component({
    selector: 'app-popover-menu',
    imports: [],
    templateUrl: './popover-menu.component.html',
    styleUrl: './popover-menu.component.scss'
})
export class PopoverMenuComponent {
  private elementPositionService = inject(ElementPositionService);
  private scrollDisablerService = inject(ScrollDisablerService);
  private document = inject<Document>(DOCUMENT);
  private destroyRef = inject(DestroyRef);


  // Input property for popover configuration
  @Input({ required: true }) props: PopoverMenuProps = {
    popoverId: '',
    anchoringConfig: {
      anchorElementId: 'user-button',
      position: 'bottom-end',
      onOutsideClickCallback: () => {},
    },
    itemGroupsConfig: {
      groups: [],
      highlightSelectedItem: false,
    },
    backdrop: 'mobile-only',
  };

  // View child references
  @ViewChild('popoverSectionsContainer')
  popoverSectionsContainer!: ElementRef;

  // Signal to track popover open/close state
  isOpenSig = signal(false);

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.cleanupSubscriptionsAndClosePopover();
  }

  private closePopover() {
    this.scrollDisablerService.enableBodyScroll(this.props.popoverId);
    this.isOpenSig.set(false);
  }

  private openPopover() {
    this.trackAnchorElement();
    this.scrollDisablerService.disableBodyScroll(this.props.popoverId);
  }

  // --- Helper Methods ---

  private setupEventListeners() {
    const popoverElement = this.popoverSectionsContainer.nativeElement;
    const anchorElement = this.getAnchorElement();

    if (!anchorElement) {
      return;
    }

    this.subscribeToAnchorClick(anchorElement);
    this.subscribeToOutsideClick(popoverElement, anchorElement);
  }

  private cleanupSubscriptionsAndClosePopover() {
    this.closePopover();
    this.untrackAnchorElement();
  }

  // --- Element Tracking ---

  private trackAnchorElement() {
    const anchorElementId = this.props.anchoringConfig.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      return;
    }

    this.subscribeToAnchorPositionChanges(anchorElementId, anchorElementRef);
  }

  private untrackAnchorElement() {
    this.elementPositionService.untrackElementPosition(
      this.props.anchoringConfig.anchorElementId,
    );
  }

  // --- Event Subscription Logic ---

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
            this.props.anchoringConfig.onOutsideClickCallback?.();
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
    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((domrect) => {
          const popoverPositioning = this.props.anchoringConfig.position;
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
      this.props.anchoringConfig.anchorElementId,
    )?.nativeElement as HTMLElement;
  }

  private updatePopoverPosition(
    popoverPositioning: string,
    anchorRect: DOMRect,
    popoverWidth: number,
    popoverHeight: number,
  ): void {
    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;

    let popoverLeft: string = '0px';
    let popoverTop: string = '0px';

    switch (popoverPositioning) {
      case 'bottom-end':
        popoverLeft = anchorRect.left - popoverWidth + anchorRect.width + 'px';
        popoverTop = anchorRect.top + anchorRect.height + 12 + 'px';
        break;

      case 'bottom':
        popoverLeft =
          anchorRect.left - (popoverWidth - anchorRect.width) / 2 + 'px';
        popoverTop = anchorRect.top + anchorRect.height + 12 + 'px';
        break;

      default:
        console.log(`positioning for ${this.props.popoverId}`);
    }

    popover.style.left = popoverLeft;
    popover.style.top = popoverTop;
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
  itemIsVisible(item: MenuItem): boolean {
    return !item.isVisibleIf || item.isVisibleIf() ? true : false;
  }

  // Determines the active class for a popover item based on its 'isActive' condition
  isActiveClass(isActiveCallback: (() => boolean) | undefined): string {
    return !isActiveCallback ||
      (isActiveCallback() && this.props.itemGroupsConfig.highlightSelectedItem)
      ? 'active'
      : '';
  }
}
