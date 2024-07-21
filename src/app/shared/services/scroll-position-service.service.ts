import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollPositionService {
  private isEnabled = false;

  // enable() {
  //   this.isEnabled = true;
  // }

  // disable() {
  //   this.isEnabled = false;
  // }

  private routesToSave: string[] = ['/lists', '/search', '/'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  saveScrollPosition(route: string, position: number): void {
    if (
      this.isEnabled &&
      isPlatformBrowser(this.platformId) &&
      this.routesToSave.includes(route)
    ) {
      sessionStorage.setItem(route, position.toString());
    }
  }

  getScrollPosition(route: string): number {
    if (
      this.isEnabled &&
      isPlatformBrowser(this.platformId) &&
      this.routesToSave.includes(route)
    ) {
      const position = sessionStorage.getItem(route);
      return position ? parseInt(position, 10) : 0;
    } else {
      return 0;
    }
  }
}
