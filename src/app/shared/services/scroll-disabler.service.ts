import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollDisablerService {
  private initialOverflow: string | null = null; // Store the original overflow style

  constructor(@Inject(DOCUMENT) private document: Document) {}

  disableScroll(element?: HTMLElement) {
    const targetElement = element || this.document.body;
    this.initialOverflow = targetElement.style.overflow;
    targetElement.style.overflow = 'hidden';
  }

  enableScroll(element?: HTMLElement) {
    const targetElement = element || this.document.body;

    if (this.initialOverflow !== null) {
      targetElement.style.overflow = this.initialOverflow;
    } else {
      targetElement.style.overflow = '';
    }
  }
}
