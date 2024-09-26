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
import { ElementPositionService } from '../../services/dom/element-position.service';
import { fromEvent, Subscription, tap } from 'rxjs';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';

export interface PopoverConfig {
  popoverId: string;
  anchoringConfig: {
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
  layout: 'list' | 'grid';
  gridSize?: { row: number; column: number };
  backdrop: 'mobile-only' | 'always' | 'none';
  itemSectionsConfig: ItemsConfigSection[];
}

interface ItemsConfigSection {
  contentType: 'icon' | 'icon-and-text' | 'text';
  sectionName: string;
  items: PopoverItem[];
}

interface PopoverItem {
  iconPath?: string;
  text?: string;
  isActive?: () => boolean; // refer to the isActiveClass() method on the end of this component's class
  isVisibleIf?: () => boolean | Signal<boolean | null | undefined>; // shows the item if true, hide otherwise // always show if this fn is not defined
  onClickCallback?: () => void;
}

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  constructor(
    private elementPositionService: ElementPositionService,
    private scrollDisablerService: ScrollDisablerService,
  ) {}
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
  private document = inject(DOCUMENT);

  @ViewChild('popoverSectionsContainer ') popoverSectionsContainer!: ElementRef;
  @ViewChild('popoverArrow ') popoverArrow!: ElementRef;

  isOpenSig = signal(false);

  elementTrackingSubscription: Subscription | null = null;
  anchorElementClickSubscription: Subscription | null = null;
  clickedOutsidePopoverSubscription: Subscription | null = null;

  ngAfterViewInit() {
    const popoverElement = this.popoverSectionsContainer.nativeElement;
    const anchorElement = this.elementPositionService.getElementRefById(
      this.popoverConfig.anchoringConfig.anchorElementId,
    )?.nativeElement as HTMLElement;

    if (!anchorElement) {
      return;
    }

    // listens for clicks in the achor element and then toggles the visibility of the popover
    this.anchorElementClickSubscription = fromEvent(anchorElement, 'click')
      .pipe(
        tap((e) => {
          this.isOpenSig.set(!this.isOpenSig());
          this.isOpenSig() ? this.openPopover() : this.closePopover();
        }),
      )
      .subscribe();

    // listens for clicks outside the popover and then closes the popover
    this.clickedOutsidePopoverSubscription = fromEvent(this.document, 'click')
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

  ngOnDestroy() {
    this.closePopover();
    this.untrackAchorElement();
    this.elementTrackingSubscription?.unsubscribe();
    this.clickedOutsidePopoverSubscription?.unsubscribe();
  }

  closePopover() {
    this.scrollDisablerService.enableBodyScroll(this.popoverConfig.popoverId);
    this.isOpenSig.set(false);
  }

  openPopover() {
    this.trackAnchorElement();
    this.scrollDisablerService.disableBodyScroll(this.popoverConfig.popoverId);
  }

  trackAnchorElement() {
    const anchorElementId = this.popoverConfig.anchoringConfig.anchorElementId;
    const anchorElementRef =
      this.elementPositionService.getElementRefById(anchorElementId);

    if (!anchorElementRef) {
      return;
    }

    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;

    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    // tracks the achor element's position and then sets it as the popover's position
    this.elementTrackingSubscription = this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        tap((domrect) => {
          const popoverPositioning =
            this.popoverConfig.anchoringConfig.position;

          if (popoverPositioning !== 'bottom-end') {
            // the popover positionings other than left-end are not handled yet.
            console.log(
              `Popover position of ${popoverPositioning} is not handled yet!`,
            );
          }
          popover.style.left =
            (domrect.left - popoverWidth + domrect.width).toString() + 'px';
          popover.style.top =
            (Math.abs(domrect.top) + domrect.height + 8).toString() + 'px';
        }),
      )
      .subscribe();
  }

  untrackAchorElement() {
    this.elementTrackingSubscription?.unsubscribe();
    this.elementPositionService.untrackElementPosition(
      this.popoverConfig.anchoringConfig.anchorElementId,
    );
  }

  itemIsVisibe(item: PopoverItem) {
    return !item.isVisibleIf || item.isVisibleIf() ? true : false;
  }

  // puts the active class to the item if its isActive() fn returns true otherwise false
  // also still puts the active class when the the item does not have defined isActive() fn
  isActiveClass(isActiveCallback: (() => boolean) | undefined): string {
    return !isActiveCallback || isActiveCallback() ? 'active' : '';
  }
}
