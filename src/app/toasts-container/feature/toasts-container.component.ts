import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent, ToastItem } from '../ui/toast/toast.component';
import { CommonModule } from '@angular/common';
import { ToastsService } from '../data-access/toasts.service';

@Component({
  selector: 'app-toasts-container',
  standalone: true,
  imports: [ToastComponent, CommonModule],
  templateUrl: '../ui/toasts-container/toasts-container.component.html',
  styleUrl: '../ui/toasts-container//toasts-container.component.scss',
})
export class ToastsContainerComponent {
  @ViewChild('toastsContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(private toastsService: ToastsService) {}

  ngAfterViewInit() {
    this.toastsService.toastsContainerRef = this.container;

    // 'kkkkkkk'.split('').forEach((item, index) => {
    //   setTimeout(() => {
    //     this.toastsService.addToast({
    //       text: 'gergregregregrgergreewfe ewfwef ewfe wefe wfewf wefew f few wef ewfwe wef ewfewfewfwefef wefwe feg',
    //       scope: 'route',
    //     });
    //   }, 300 * index);
    // });
  }
}
