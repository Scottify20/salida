import { Component, ElementRef, Inject, Input, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT, ViewportScroller } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformCheckService } from '../../services/dom/platform-check.service';

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
    private platformCheck: PlatformCheckService,
  ) {}

  @Input() PillTabsConfig: PillTabsConfig = {
    navTabs: {
      tabType: 'navigation',
      buttonContent: 'text',
      tabs: [],
    },
  };

  getTruncatedText(text: string | null): string | null {
    return text && text.length < 12
      ? text
      : text
        ? text.slice(0, 7).replace(/\s$/, '') +
          '...' +
          text.slice(-3).replace(/^\s/, '')
        : null;
  }

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
    tabType: TabButtonContent,
  ): boolean {
    return tabTypes.indexOf(tabType) != -1 ? true : false;
  }

  scrollToPillTab() {
    const pillTabsElement = this.elementRef.nativeElement;
    window.scrollTo({
      top: pillTabsElement.offsetTop - 16,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollToTop() {
    if (this.platformCheck.isBrowser()) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  handleTabClick(
    callback: (() => void) | undefined,
    tabIndex: number,
    isMainTab: boolean,
  ) {
    if (isMainTab) {
      const previousIndex = this.activeTabIndex;

      if (tabIndex == 0) {
        // scrolls to top if the tab clicked is the first tab
        // this.scrollToTop();
      }

      if (tabIndex != 0) {
        // scrolls to top if the tab clicked is the second or subsequent tabs
        // this.scrollToPillTab();
      }

      if (tabIndex == previousIndex) {
        // disables animation when tab is already click and active
        return;
      }

      this.activeTabIndex = tabIndex;

      const direction = tabIndex > previousIndex ? 'right' : 'left';
      const animationClass =
        direction === 'right' ? 'slide-in-from-right' : 'slide-in-from-left';

      const routerOutletContainer = this.elementRef.nativeElement
        .closest('.pill-tab-parent')
        .querySelector('[pill-tab-transition]');
      if (routerOutletContainer) {
        routerOutletContainer.classList.add(animationClass);

        setTimeout(() => {
          routerOutletContainer.classList.remove(animationClass);
        }, 350);

        return;
      }
    }

    if (callback) {
      callback();
    }
  }
}

export interface PillTabsConfig {
  navTabs: PillTabGroup;
  leftTabs2?: PillTabGroup;
  leftTabs1?: PillTabGroup;
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
  dynamicText?: () => string | null;
  text?: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
  routerLinkPath?: string;
  callback?: () => void;
  visibleOn: string[] | ['all']; // 'all' | 'movie' | 'series' | 'movie\\d+/releases' | etc.
  visibleIf?: () => boolean;
  isSelected?: () => boolean;
}
