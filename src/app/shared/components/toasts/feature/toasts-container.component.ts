import {
  Component,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ToastsService } from '../data-access/toasts.service';
import { PlatformCheckService } from '../../../services/dom/platform-check.service';

@Component({
  selector: 'app-toasts-container',
  imports: [],
  templateUrl: '../ui/toasts-container/toasts-container.component.html',
  styleUrl: '../ui/toasts-container//toasts-container.component.scss',
})
export class ToastsContainerComponent {
  @ViewChild('toastsContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(
    private toastsService: ToastsService,
    private renderer: Renderer2,
    private platformCheckService: PlatformCheckService,
  ) {}

  commonIcons: string[] = [
    '/assets/icons/toast/close.svg',
    '/icons/toast/error.svg',
  ];

  ngOnInit() {
    this.preloadCommonIcons();
  }

  preloadCommonIcons() {
    if (this.platformCheckService.isServer()) {
      return;
    }
    // Preload common SVG icons for toasts
    this.commonIcons.forEach((iconPath) => {
      const link = this.renderer.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = iconPath;
      this.renderer.appendChild(document.head, link);
    });
  }

  ngAfterViewInit() {
    this.toastsService.toastsContainerRef = this.container;
  }
}
