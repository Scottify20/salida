import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastsService } from '../../data-access/toasts.service';
import { ToastItem } from '../../feature/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  constructor(protected toastsService: ToastsService) {}

  @Input() toastProps: ToastItem = {
    text: '',
    scope: 'route',
  };

  closed = false;

  async closeToast() {
    const props = this.toastProps;
    if (props.idBasedOnContent) {
      await this.toastsService.removeToast(props.idBasedOnContent);
    }
  }
}
