import { Component, Input, inject } from '@angular/core';
import { ToastsService } from '../../data-access/toasts.service';
import { ToastItem } from '../../data-access/toast.model';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss'
})
export class ToastComponent {
  protected toastsService = inject(ToastsService);


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
