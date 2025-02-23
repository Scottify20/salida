import { Component, DestroyRef, Input, Output, signal } from '@angular/core';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { debounceTime, fromEvent, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WindowResizeService } from '../../services/dom/window-resize.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scroll-buttons',
  imports: [],
  templateUrl: './scroll-buttons.component.html',
  styleUrl: './scroll-buttons.component.scss',
})
export class ScrollButtonsComponent {
  constructor(
    private platformCheck: PlatformCheckService,
    private destroyRef: DestroyRef,
    private resizeListener: WindowResizeService,
  ) {}

  @Output() scrollBtnClicked = new EventEmitter<'left' | 'right'>();

  ngAfterViewInit() {
    if (this.platformCheck.isServer()) {
      return;
    }

    setTimeout(() => {
      this.setValues();
      this.startScrollListening();
      this.startResizeListening();
    }, 500);
  }

  @Input({ required: true }) containerElement!: HTMLElement;
  @Input() positionValues: positionValues = { top: '0', left: '0' };
  @Input({ required: true }) numberOfItems!: number;

  isLeftBtnVisible = signal(false);
  isRightBtnVisible = signal(false);

  cardWidth = 0;
  gap = 0;
  visibleCount = 0;
  fillerWidth = 0;

  scroll(direction: 'left' | 'right') {
    const scrollAmountToRight =
      this.containerElement.scrollLeft +
      this.cardWidth * this.visibleCount +
      this.gap * this.visibleCount;

    const scrollAmountToLeft =
      this.containerElement.scrollLeft -
      (this.cardWidth * this.visibleCount + this.gap * this.visibleCount);

    if (direction === 'left') {
      this.containerElement.scrollTo({
        left: scrollAmountToLeft,
        behavior: 'smooth',
      });
    } else {
      this.containerElement.scrollTo({
        left: scrollAmountToRight,
        behavior: 'smooth',
      });
    }
  }

  setValues() {
    const containerLeft = this.containerElement.getBoundingClientRect().left;
    const containerRight = this.containerElement.getBoundingClientRect().right;
    const style = getComputedStyle(this.containerElement);

    this.gap = parseFloat(style.getPropertyValue('column-gap'));
    this.visibleCount = 0;

    const cards = Array.from(this.containerElement.children) as HTMLElement[];
    const cardCountDiff =
      this.containerElement.children.length - this.numberOfItems;

    // remove filler cards
    if (cardCountDiff > 0) {
      this.fillerWidth = cards[0].offsetWidth;

      for (let i = 0; i < cardCountDiff; i++) {
        const isEven = i % 2 === 0;
        if (isEven) {
          cards.shift();
        } else {
          cards.pop();
        }
      }
    }

    this.cardWidth = cards[0].offsetWidth;

    // count the number of visible cards
    cards.forEach((child) => {
      const childRect = child.getBoundingClientRect();
      const childLeft = childRect.left;
      const childRight = childRect.right;

      if (childLeft >= containerLeft && childRight <= containerRight) {
        this.visibleCount++;
      }
    });

    // initial visibity setting
    this.isLeftBtnVisible.set(
      this.containerElement.scrollLeft > this.fillerWidth,
    );
    this.isRightBtnVisible.set(
      this.containerElement.scrollLeft + this.containerElement.clientWidth <
        this.numberOfItems * this.cardWidth +
          (this.numberOfItems - 1) * this.gap,
    );
  }

  startScrollListening() {
    // scrollListening and visibity setting
    fromEvent(this.containerElement, 'scroll')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(100),
        map(() => this.containerElement.scrollLeft),
      )
      .subscribe((scrollLeft) => {
        this.isLeftBtnVisible.set(scrollLeft > this.fillerWidth);

        this.isRightBtnVisible.set(
          scrollLeft + this.containerElement.clientWidth <
            this.numberOfItems * this.cardWidth +
              (this.numberOfItems - 1) * this.gap,
        );
      });
  }

  startResizeListening() {
    this.resizeListener.windowResizeState$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        map(() => {}),
      )
      .subscribe((resizeState) => {
        this.setValues();
      });
  }
}

type positionValues = {
  top: string;
  left?: string;
  right?: string;
};
