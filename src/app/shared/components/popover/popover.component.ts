import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Inject,
  Input,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ElementPositionService } from '../../services/dom/element-position.service';
import { BehaviorSubject, fromEvent, Subscription, tap } from 'rxjs';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { PlatformCheckService } from '../../services/dom/platform-check.service';

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
  isActive?: () => boolean;
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

    this.anchorElementClickSubscription = fromEvent(anchorElement, 'click')
      .pipe(
        tap((e) => {
          this.isOpenSig.set(!this.isOpenSig());
          this.isOpenSig() ? this.openPopover() : this.closePopover();
        }),
      )
      .subscribe();

    this.clickedOutsidePopoverSubscription = fromEvent(this.document, 'click')
      .pipe(
        tap((e) => {
          if (e.target != popoverElement && e.target != anchorElement) {
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

    const anchorElement = anchorElementRef?.nativeElement as HTMLDivElement;

    const popover = this.popoverSectionsContainer
      .nativeElement as HTMLDivElement;

    const anchorHeight = anchorElement.offsetHeight;
    const anchorWidth = anchorElement.offsetWidth;
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    this.elementTrackingSubscription = this.elementPositionService
      .trackElementPosition$(anchorElementId, anchorElementRef)
      .pipe(
        tap((domrect) => {
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

  isActiveClass(isActiveCallback: (() => boolean) | undefined): string {
    return !isActiveCallback || isActiveCallback() ? 'active' : '';
  }
}
