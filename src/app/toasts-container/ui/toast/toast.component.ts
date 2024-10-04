
import { Component, Input } from '@angular/core';
import { ToastsService } from '../../data-access/toasts.service';
import { ToastItem } from '../../data-access/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
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
