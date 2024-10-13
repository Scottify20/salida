import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
} from '@angular/core';

export interface PillIndexedTabsProps {
  buttonContent: TabButtonContent;
  tabs: TabItem[];
}

export type TabButtonContent = 'text' | 'text-and-icon';

interface TabItem {
  text: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
}

@Component({
  selector: 'app-pill-indexed-tabs',
  standalone: true,
  imports: [],
  templateUrl: './pill-indexed-tabs.component.html',
  styleUrl: './pill-indexed-tabs.component.scss',
})
export class PillIndexedTabsComponent {
  constructor(private elementRef: ElementRef) {}

  @Input({ required: true }) pillIndexedTabsProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [],
  };

  @Output() tabIndex = new EventEmitter<number>();

  currentTabIndex = 0;

  setNewTabIndex(newIndex: number) {
    this.currentTabIndex = newIndex;
    this.tabIndex.emit(newIndex);
  }

  handleTabClick(newIndex: number) {
    const previousIndex = this.currentTabIndex;

    this.setNewTabIndex(newIndex);

    if (newIndex === previousIndex) {
      return;
    }

    const direction = newIndex > previousIndex ? 'right' : 'left';
    const animationClass =
      direction === 'right' ? 'slide-in-from-right' : 'slide-in-from-left';

    const parentContainer = this.elementRef.nativeElement.closest(
      '[pill-tab-parent]',
    ) as HTMLElement;
    const componentViewsContainer = parentContainer.querySelector(
      '[pill-tab-transition]',
    );

    if (componentViewsContainer) {
      parentContainer.style.overflow = 'hidden';
      componentViewsContainer.classList.add(animationClass);

      componentViewsContainer.addEventListener('animationend', (e) => {
        componentViewsContainer.classList.remove(animationClass);
        parentContainer.style.overflow = 'visible';
      });
      return;
    }
  }
}
