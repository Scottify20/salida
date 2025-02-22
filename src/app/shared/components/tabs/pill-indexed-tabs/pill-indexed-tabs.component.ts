import {
  Component,
  Output,
  EventEmitter,
  Input,
  Signal,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  filter,
  fromEvent,
  map,
  pairwise,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';

export interface PillIndexedTabsProps {
  buttonContent: TabButtonContent;
  tabs: TabItem[];
  animationType: 'none' | 'slide' | 'fade';
  defaultTabIndex?: Signal<number>;
  swipeGestures: boolean;
}

export type TabButtonContent = 'text' | 'text-and-icon';

interface TabItem {
  text: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
  onClickCallback?: () => void;
}

@Component({
  selector: 'app-pill-indexed-tabs',
  imports: [],
  templateUrl: './pill-indexed-tabs.component.html',
  styleUrl: './pill-indexed-tabs.component.scss',
})
export class PillIndexedTabsComponent {
  constructor(private destroyRef: DestroyRef) {}

  @Input({ required: true }) props: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [],
    defaultTabIndex: signal(0),
    animationType: 'none',
    swipeGestures: false,
  };
  @Output() tabIndex = new EventEmitter<number>();

  currentTabIndex = 0;
  ngOnInit() {
    this.currentTabIndex = this.props.defaultTabIndex?.() || 0;
  }

  @Input({ required: true }) parentContainer!: HTMLElement;
  @Input({ required: true }) viewsContainer!: HTMLElement;
  @Input({ required: true }) overflowClipper!: HTMLElement;

  ngAfterViewInit() {
    if (this.props.swipeGestures) {
      this.startSwipeListener();
    }
  }

  startSwipeListener() {
    const clipper = this.overflowClipper;
    const viewsContainer = this.viewsContainer;
    let currentX = 0;
    let velocityX = 0;
    let animationFrameId: number | null = null;
    let tabSwitched = false;
    let isSwiping = false;
    let startX = 0;

    clipper.style.touchAction = 'pan-y';

    const pointerDown$ = fromEvent<PointerEvent>(clipper, 'pointerdown', {
      capture: true,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((e) => e.pointerType === 'touch'),
      filter((e) => {
        const x = e.clientX;
        const viewportWidth = window.innerWidth;
        return x > 40 && x < viewportWidth - 40;
      }),
      tap((event) => {
        isSwiping = true;
        startX = event.clientX;
        currentX = 0;
        velocityX = 0;
        tabSwitched = false;
        clipper.style.position = 'relative';
        viewsContainer.style.userSelect = 'none';
        viewsContainer.style.pointerEvents = 'none';
      }),
    );

    const pointerMove$ = fromEvent<PointerEvent>(clipper, 'pointermove', {
      capture: true,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((e) => e.pointerType === 'touch' && isSwiping),
      map((curr) => {
        const dx = curr.clientX - startX;
        velocityX = dx * 0.3;
        startX = curr.clientX;
        return dx;
      }),
    );

    const pointerUp$ = fromEvent<PointerEvent>(clipper, 'pointerup', {
      capture: true,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        isSwiping = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        if (
          (this.currentTabIndex === 0 && currentX > 0) ||
          (this.currentTabIndex === this.props.tabs.length - 1 && currentX < 0)
        ) {
          smoothSnapBack();
          return;
        }

        const threshold = Math.min(clipper.offsetWidth / 2, 300);
        const velocityThreshold = 0.5;

        if (
          Math.abs(currentX) > threshold ||
          (Math.abs(velocityX) > velocityThreshold && !tabSwitched)
        ) {
          const direction = currentX > 0 ? -1 : 1;
          const newIndex = this.currentTabIndex + direction;

          if (newIndex >= 0 && newIndex < this.props.tabs.length) {
            this.handleTabClick(newIndex);
            currentX = 0;
            viewsContainer.style.transform = `translateX(0px)`;
            velocityX = 0;
            tabSwitched = true;
          }
        } else {
          smoothSnapBack();
        }
        clipper.style.position = 'unset';
        this.parentContainer.style.overflow = 'unset';
        viewsContainer.style.userSelect = 'auto';
        viewsContainer.style.pointerEvents = 'auto';
      }),
    );

    pointerDown$
      .pipe(
        switchMap(() =>
          pointerMove$.pipe(
            takeUntilDestroyed(this.destroyRef),
            takeUntil(pointerUp$),
            tap((dx) => applyTransform(dx)),
          ),
        ),
      )
      .subscribe();

    const applyTransform = (dx: number) => {
      currentX += dx;

      if (this.currentTabIndex === 0 && currentX > 0) {
        currentX *= 0.95; // Apply friction when swiping beyond the first tab
      } else if (
        this.currentTabIndex === this.props.tabs.length - 1 &&
        currentX < 0
      ) {
        currentX *= 0.95; // Apply friction when swiping beyond the last tab
      }

      viewsContainer.style.transform = `translateX(${currentX}px)`;
    };

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    const smoothSnapBack = () => {
      let startTime: number | null = null;
      const duration = 300;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        currentX = currentX * (1 - easedProgress);

        if (progress < 1) {
          viewsContainer.style.transform = `translateX(${currentX}px)`;
          animationFrameId = requestAnimationFrame(animate);
        } else {
          viewsContainer.style.transform = 'translateX(0px)';
          viewsContainer.style.userSelect = 'auto';
          viewsContainer.style.pointerEvents = 'auto';
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };
  }

  setNewTabIndex(newIndex: number) {
    this.currentTabIndex = newIndex;
    this.tabIndex.emit(newIndex);
  }

  handleTabClick(newIndex: number) {
    this.props.tabs[newIndex].onClickCallback?.();

    const previousIndex = this.currentTabIndex;

    this.setNewTabIndex(newIndex);

    if (newIndex === previousIndex) {
      return;
    }

    const direction = newIndex > previousIndex ? 'right' : 'left';

    const animationClass = () => {
      const animationType = this.props.animationType;

      if (animationType === 'none') {
        return '';
      }

      // if animation direction is right
      if (direction === 'right') {
        return animationType === 'slide'
          ? 'slide-in-from-right'
          : animationType === 'fade'
            ? 'fade-in'
            : '';
      }

      // if animation direction is left
      return animationType === 'slide'
        ? 'slide-in-from-left'
        : animationType === 'fade'
          ? 'fade-in'
          : '';
    };

    if (this.viewsContainer && this.overflowClipper) {
      this.overflowClipper.style.overflow = 'hidden';
      const animationClassName = animationClass();
      if (animationClassName) {
        this.viewsContainer.classList.add(animationClassName);

        this.viewsContainer.addEventListener('animationend', (e) => {
          this.viewsContainer?.classList.remove(animationClassName);
          if (!this.overflowClipper) {
            return;
          }
          this.overflowClipper.style.overflow = 'visible';
        });
      }
      return;
    }
  }
}
