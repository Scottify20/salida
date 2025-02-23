import { Injectable, NgModule, PLATFORM_ID, inject } from '@angular/core';
import { PlatformCheckService } from './platform-check.service';

export type IntersectionCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void;

@Injectable({ providedIn: 'root' })
export class IntersectionObserverService {
  private platformCheckService = inject(PlatformCheckService);

  private observer: IntersectionObserver | null = null;

  observe(
    target: Element,
    callback: IntersectionCallback,
    options?: IntersectionObserverInit,
  ): IntersectionObserver | null {
    if (this.platformCheckService.isBrowser()) {
      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(target);
      return this.observer;
    }

    return null;
  }

  unobserve(target: Element) {
    if (this.observer) {
      this.observer.unobserve(target);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  takeRecords(): IntersectionObserverEntry[] {
    return this.observer ? this.observer.takeRecords() : [];
  }
}
