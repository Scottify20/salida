import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PlatformCheckService } from '../../services/platform-check.service';
import {
  WindowResizeDimensionService,
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
export class PopupOrBottomSheetComponent {
  constructor(
    private platformCheck: PlatformCheckService,
    private elemPositionService: ElementPositionService
  ) {}

  anchorElementPosition$: Observable<DOMRect> | undefined;

  @Input() anchorElementId: string = '';

  @ViewChild('dialog') dialogElementRef!: ElementRef;
  private dialogElement!: HTMLDialogElement;

  ngAfterViewInit() {
    this.trackAnchorElement();
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
          console.log('Element position:', position);
        });
      } else {
        console.log('anchor element ref does not exist', this.anchorElementId);
      }
    }, 50);
  }

  ngOnDestroy(): void {
    this.elemPositionService.untrackElementPosition(this.anchorElementId);
  }

  showDialog() {
    if (this.platformCheck.isBrowser()) {
      console.log('shown');
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
