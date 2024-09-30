import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { DialogProps } from '../../data-access/dialog.model';
import { DialogService } from '../../data-access/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    private elementRef: ElementRef,
    private dialogService: DialogService,
  ) {
    if (this.dialogProps.isOpen) {
      this.showDialog();
    }
  }

  @Input({ required: true }) dialogProps: DialogProps = {
    id: '',
    isBackdropEnabled: false,
    isOpen: false,
  };

  showDialog() {
    this.dialogService.addDialog(this.dialogProps.id, this.elementRef);
  }

  closeDialog() {
    console.log('close clicked');
    this.dialogService.removeDialog(this.dialogProps.id);
  }
}
