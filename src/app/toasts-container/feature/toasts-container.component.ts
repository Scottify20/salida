import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ToastComponent } from '../ui/toast/toast.component';

import { ToastsService } from '../data-access/toasts.service';

@Component({
  selector: 'app-toasts-container',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: '../ui/toasts-container/toasts-container.component.html',
  styleUrl: '../ui/toasts-container//toasts-container.component.scss',
})
export class ToastsContainerComponent {
  @ViewChild('toastsContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(private toastsService: ToastsService) {}

  ngAfterViewInit() {
    this.toastsService.toastsContainerRef = this.container;
  }
}
