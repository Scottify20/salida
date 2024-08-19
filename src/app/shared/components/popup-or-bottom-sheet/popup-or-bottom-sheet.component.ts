import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PlatformCheckService } from '../../services/platform-check.service';
import {
  WindowResizeService,
  WindowResizeServiceUser,
} from '../../services/window-resize.service';
import { Observable, Subscription } from 'rxjs';
import {
  ElementPositionService,
  ElementPositionServiceUser,
} from '../../services/element-position.service';

@Component({
  selector: 'app-popup-or-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './popup-or-bottom-sheet.component.html',
  styleUrl: './popup-or-bottom-sheet.component.scss',
})
export class PopupOrBottomSheetComponent implements WindowResizeServiceUser {
  constructor(
    private platformCheck: PlatformCheckService,
    private elemPositionService: ElementPositionService,
    private windowResizeService: WindowResizeService
  ) {}

  isResizing = false;
  windowDimensions: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;

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

  anchorElementPosition$: Observable<DOMRect> | undefined;
  popupElementPosition$: Observable<DOMRect> | undefined;

  @Input() anchorElementId: string = '';

  @ViewChild('dialog') dialogElementRef!: ElementRef;
  dialogElement!: HTMLDialogElement;
  dialogPopupElement!: HTMLDivElement;

  ngAfterViewInit() {
    this.dialogElement = this.dialogElementRef.nativeElement;
    this.dialogPopupElement = this.dialogElement.querySelector(
      '.dialog__arrow-and-items-container'
    ) as HTMLDivElement;

    this.trackAnchorElement();
    this.showDialog();
  }

  trackAnchorElement() {
    setTimeout(() => {
      const anchorElementRef = this.elemPositionService.getElementRefById(
        this.anchorElementId
      );

      if (anchorElementRef) {
        this.anchorElementPosition$ =
          this.elemPositionService.trackElementPosition(
            this.anchorElementId,
            anchorElementRef
          );

        this.anchorElementPosition$.subscribe((position) => {
          const popup = this.dialogPopupElement.getBoundingClientRect();

          if (this.windowDimensions.width <= 480) {
            this.dialogPopupElement.style.top = 'unset';
            this.dialogPopupElement.style.bottom = '0';
            this.dialogPopupElement.style.left = 'unset';
            return;
          }
          const diff = (popup.width - position.width) / 2;

          this.dialogPopupElement.style.top = '33.25rem';
          this.dialogPopupElement.style.bottom = 'unset';
          this.dialogPopupElement.style.left =
            (position.left - diff).toString() + 'px';
        });
      } else {
        console.log('anchor element ref does not exist', this.anchorElementId);
      }
    }, 50);
  }

  ngOnDestroy(): void {
    this.elemPositionService.untrackElementPosition(this.anchorElementId);
    this._resizeSubscription?.unsubscribe();
    this._isResizingSubscription?.unsubscribe();
  }

  showDialog() {
    if (this.platformCheck.isBrowser()) {
      this.dialogElement.showModal();
    }
  }

  hideDialog() {
    if (this.platformCheck.isBrowser()) {
      this.dialogElement.remove();
    }
  }
}

export interface AnchoringInfo {
  dialogElementRef: ElementRef | null;
  anchorElementId: string;
}
