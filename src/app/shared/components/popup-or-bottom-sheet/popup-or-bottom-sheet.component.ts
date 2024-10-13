import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { WindowResizeService } from '../../services/dom/window-resize.service';
import { Observable, of, Subscription, tap } from 'rxjs';
import { ElementPositionService } from '../../services/dom/element-position.service';
import { CommonModule } from '@angular/common';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';

@Component({
  selector: 'app-popup-or-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-or-bottom-sheet.component.html',
  styleUrl: './popup-or-bottom-sheet.component.scss',
})
export class PopupOrBottomSheetComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  constructor(
    private elemPositionService: ElementPositionService,
    private windowResizeService: WindowResizeService,
    private scrollDisabler: ScrollDisablerService,
    private platformCheckService: PlatformCheckService,
  ) {}

  @Input() popUpOrBottomSheetConfig: PopupOrBottomSheetConfig = {
    anchorElementId: null,
    itemsType: 'texts',
    items: [],
    isPopupShownSig: signal(null),
  };

  ngOnInit() {
    this.initializeResizeSubscriptions();
  }

  ngOnDestroy() {
    this.untrackAndUnsubscribe();
  }

  @ViewChild('dialog') dialogElementRef!: ElementRef;
  dialogElement!: HTMLDialogElement;
  dialogPopupElement!: HTMLDivElement;

  anchorElementPosition$: Observable<DOMRect> | undefined;
  popupElementPosition$: Observable<DOMRect> | undefined;

  showDialog() {
    setTimeout(() => {
      this.dialogElement.classList.remove('hide');
      this.dialogElement.classList.add('shown');
    }, 0);
  }

  hideDialog() {
    this.elemPositionService.triggerManualUpdate();
    this.dialogElement.classList.add('hide');
    this.dialogElement.classList.remove('shown');
    this.windowResizeService.triggerResize();
    this.scrollDisabler.enableBodyScroll('season-picker-popup-or-bottom-sheet');
  }

  ngAfterViewInit() {
    if (!this.platformCheckService.isBrowser()) {
      return;
    }

    this.startSeasonPickerDialogPositioner();
    this.trackAnchorElement();
  }

  startSeasonPickerDialogPositioner() {
    this.dialogElement = this.dialogElementRef.nativeElement;
    this.dialogPopupElement = this.dialogElement.querySelector(
      '.dialog__arrow-and-items-container',
    ) as HTMLDivElement;

    this.trackAnchorElement();
  }

  private anchorElementPositionSubscription: Subscription | undefined;

  trackAnchorElement() {
    // Unsubscribe from the previous subscription if it exists
    if (this.anchorElementPositionSubscription) {
      this.anchorElementPositionSubscription.unsubscribe();
    }

    // Use PlatformCheckService to determine the scheduling function
    const scheduleFn = this.platformCheckService.isBrowser()
      ? requestAnimationFrame
      : setTimeout;

    scheduleFn(() => {
      if (!this.popUpOrBottomSheetConfig.anchorElementId) {
        console.log('anchor element id not set');
        return;
      }
      const anchorElementRef = this.elemPositionService.getElementRefById(
        this.popUpOrBottomSheetConfig.anchorElementId,
      );

      if (anchorElementRef) {
        this.anchorElementPosition$ =
          this.elemPositionService.trackElementPosition$(
            this.popUpOrBottomSheetConfig.anchorElementId,
            anchorElementRef,
          );

        this.anchorElementPositionSubscription =
          this.anchorElementPosition$.subscribe((position) => {
            const popup = this.dialogPopupElement.getBoundingClientRect();

            if (this.windowDimensions?.width <= 600) {
              // Optional chaining for safety
              this.dialogPopupElement.style.top = 'unset';
              this.dialogPopupElement.style.bottom = '0';
              this.dialogPopupElement.style.left = 'unset';
              return;
            }
            const diff = (popup.width - position.width) / 2;

            this.dialogPopupElement.style.top =
              (position.top + (position.height + 32)).toString() + 'px';
            this.dialogPopupElement.style.bottom = 'unset';
            this.dialogPopupElement.style.left =
              (position.left - diff).toString() + 'px';
          });
      }
    });
  }

  initializeResizeSubscriptions() {
    // Subscribe to the combined windowResizeState$ observable
    this._resizeSubscription =
      this.windowResizeService.windowResizeState$.subscribe((state) => {
        this.isResizing = state.isResizing;
        this.windowDimensions = state.dimensions;
      });
  }

  untrackAndUnsubscribe() {
    if (!this.popUpOrBottomSheetConfig.anchorElementId) {
      console.log('anchor element id not set');
      return;
    }

    this.elemPositionService.untrackElementPosition(
      this.popUpOrBottomSheetConfig.anchorElementId,
    );
    this._resizeSubscription?.unsubscribe();
    this.anchorElementPositionSubscription?.unsubscribe();
  }

  isResizing = false;
  windowDimensions: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  _resizeSubscription!: Subscription;
}

export interface PopupOrBottomSheetConfig {
  anchorElementId: string | null;
  itemsType: 'texts' | 'icon-grid';
  items: PopupItem[];
  isPopupShownSig: WritableSignal<boolean | null>;
}

export interface PopupItem {
  textContent: string;
  callback: () => void;
  isSelected: () => boolean;
}

export interface AnchoringInfo {
  dialogElementRef: ElementRef | null;
  anchorElementId: string;
}
