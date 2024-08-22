import { Component, ElementRef, Inject, Input, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT, ViewportScroller } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-pill-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './pill-tabs.component.html',
  styleUrl: './pill-tabs.component.scss',
})
export class PillTabsComponent {
  constructor(
    private router: Router,
    public elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @Input() PillTabsConfig: PillTabsConfig = {
    mainTabs: {
      tabType: 'navigation',
      buttonContent: 'text',
      tabs: [],
    },
  };

  activeTabIndex = 0;

  // returns true if at least one of the string routes defined inside the routesVisibleIn array matches the current router URL
  // returns false if there are not matches
  isVisibleOnRoutes(routesVisibleIn: string[] | ['all']): boolean {
    if (routesVisibleIn[0] == 'all') {
      return true;
    }

    const routerUrl = this.router.url;

    return routesVisibleIn.some((route) => {
      const routeRegex = new RegExp(route);
      return routeRegex.test(routerUrl);
    });
  }

  isVisibleIf(callback: () => boolean): boolean {
    return callback();
  }

  isInTabTypes(
    tabTypes: TabButtonContent[],
    tabType: TabButtonContent
  ): boolean {
    return tabTypes.indexOf(tabType) != -1 ? true : false;
  }

  scrollToPillTab() {
    setTimeout(() => {
      const pillTabsElement = this.elementRef.nativeElement;
      this.viewportScroller.scrollToPosition([
        0,
        pillTabsElement.offsetTop - 16,
      ]);
    }, 0);
  }

  scrollToTop() {
    setTimeout(() => {
      this.document.defaultView?.scrollTo(0, 0);
    }, 0);
  }

  handleTabClick(
    callback: (() => void) | undefined,
    tabIndex: number,
    isMainTab: boolean
  ) {
    if (isMainTab) {
      const previousIndex = this.activeTabIndex;

      if (tabIndex != 0) {
        this.scrollToPillTab();
      }
      if (tabIndex === previousIndex) {
        return;
      }

      this.activeTabIndex = tabIndex;

      const direction = tabIndex > previousIndex ? 'right' : 'left';
      const animationClass =
        direction === 'right' ? 'slide-in-from-right' : 'slide-in-from-left';

      const routerOutletContainer = this.elementRef.nativeElement
        .closest('.title-details')
        .querySelector('[title-pill-tab-transition]');
      if (routerOutletContainer) {
        routerOutletContainer.classList.add(animationClass);

        setTimeout(() => {
          routerOutletContainer.classList.remove(animationClass);
        }, 300);

        return;
      }
    }

    if (callback) {
      callback();
    }
  }
}

export interface PillTabsConfig {
  leftTabs2?: PillTabGroup;
  leftTabs1?: PillTabGroup;
  mainTabs: PillTabGroup;
  rightTabs1?: PillTabGroup;
  rightTabs2?: PillTabGroup;
  [key: string]: PillTabGroup | undefined;
}

interface PillTabGroup {
  tabType: 'navigation' | 'toggle-switch' | 'toggle-button' | 'dropdown';
  buttonContent: TabButtonContent;
  tabs: TabItem[];
}

export type TabButtonContent =
  | 'text'
  | 'icon'
  | 'text-then-icon'
  | 'icon-then-text'
  | 'dynamic-text'
  | 'dynamic-text-then-icon'
  | 'icon-then-dynamic-text';

interface TabItem {
  id?: string;
  dynamicText?: () => string;
  text?: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
  routerLinkPath?: string;
  callback?: () => void;
  visibleOn: string[] | ['all']; // 'all' | 'movies' | 'series' | 'movies\\d+/releases' | etc.
  visibleIf?: () => boolean;
  isSelected?: () => boolean;
}
