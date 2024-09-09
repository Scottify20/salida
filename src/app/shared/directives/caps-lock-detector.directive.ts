import {
  Directive,
  ElementRef,
  Host,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appCapsLockDetector]',
  standalone: true,
})
export class CapsLockDetectorDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputElement = this.el.nativeElement;

    if (event.getModifierState('CapsLock')) {
      this.renderer.addClass(inputElement, 'caps-on');
    } else {
      this.renderer.removeClass(inputElement, 'caps-on');
    }
  }
}
