import { Component, ElementRef, ViewChild } from '@angular/core';
import { PlatformCheckService } from '../../services/platform-check.service';

@Component({
  selector: 'app-popup-or-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './popup-or-bottom-sheet.component.html',
  styleUrl: './popup-or-bottom-sheet.component.scss',
})
export class PopupOrBottomSheetComponent {
  @ViewChild('dialog') dialogElementRef!: ElementRef;
  private dialogElement!: HTMLDialogElement;

  constructor(private platformCheck: PlatformCheckService) {}

  ngAfterViewInit() {
    this.dialogElement = this.dialogElementRef.nativeElement;

    this.showDialog();
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
