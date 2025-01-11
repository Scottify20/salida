import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Signal,
  signal,
} from '@angular/core';

export interface PillIndexedTabsProps {
  buttonContent: TabButtonContent;
  tabs: TabItem[];
  animationType: 'none' | 'slide' | 'fade';
  defaultTabIndex?: Signal<number>;
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
  constructor(private elementRef: ElementRef) {}

  @Input({ required: true }) props: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [],
    defaultTabIndex: signal(0),
    animationType: 'none',
  };

  ngOnInit() {
    this.currentTabIndex = this.props.defaultTabIndex?.() || 0;
  }

  @Output() tabIndex = new EventEmitter<number>();

  currentTabIndex = 0;

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

    const parentContainer = this.elementRef.nativeElement.closest(
      '[pill-tab-parent]',
    ) as HTMLElement;

    const overflowClipper = parentContainer.querySelector(
      '[pill-tab-overflow-clipper]',
    ) as HTMLElement;

    const componentViewsContainer = parentContainer.querySelector(
      '[pill-tab-component-transition]',
    ) as null | HTMLElement;

    if (componentViewsContainer) {
      overflowClipper.style.overflow = 'hidden';
      const animationClassName = animationClass();
      if (animationClassName) {
        componentViewsContainer.classList.add(animationClassName);

        componentViewsContainer.addEventListener('animationend', (e) => {
          componentViewsContainer.classList.remove(animationClassName);
          overflowClipper.style.overflow = 'visible';
        });
      }
      return;
    }
  }
}
