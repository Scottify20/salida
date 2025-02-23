import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollDisablerService {
  private document = inject<Document>(DOCUMENT);


  scrollLockingElementIDs: string[] = [];

  disableBodyScroll(elementId: string) {
    this.scrollLockingElementIDs.push(elementId);

    const body = this.document.body;
    body.classList.add('scroll-disabled');
  }

  enableBodyScroll(elementId: string) {
    this.scrollLockingElementIDs.splice(
      this.scrollLockingElementIDs.indexOf(elementId),
      1,
    );

    const body = this.document.body;
    if (!this.scrollLockingElementIDs[0]) {
      body.classList.remove('scroll-disabled');
    }
  }

  // disableScroll(element?: HTMLElement) {
  //   const targetElement = element || this.document.body;
  //   this.initialOverflow = targetElement.style.overflow;
  //   targetElement.style.overflow = 'hidden';
  // }

  // enableScroll(element?: HTMLElement) {
  //   const targetElement = element || this.document.body;

  //   if (this.initialOverflow !== null) {
  //     targetElement.style.overflow = this.initialOverflow;
  //   } else {
  //     targetElement.style.overflow = '';
  //   }
  // }
}
