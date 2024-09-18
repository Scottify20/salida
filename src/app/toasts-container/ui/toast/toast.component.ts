import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastsService } from '../../data-access/toasts.service';

type ActionButtonType = 'accent' | 'danger' | 'warning' | 'success' | 'neutral';

export interface ToastItem {
  idBasedOnContent?: string;
  iconPath?: string;
  text: string;
  actionButton?: {
    type: ActionButtonType;
    callback?: () => void;
    label?: string;
    iconPath?: string;
  };
  scope: 'global' | 'route';
  duration?: number;
}

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

  closeToast() {
    const props = this.toastProps;
    if (props.idBasedOnContent) {
      this.toastsService.removeToast(props.idBasedOnContent);
    }

    console.log('closing ' + props.idBasedOnContent);
  }
}
