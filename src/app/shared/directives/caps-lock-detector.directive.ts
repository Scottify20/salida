import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCapsLockDetector]',
  standalone: true,
})
export class CapsLockDetectorDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);


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
