import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-pill-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './pill-tabs.component.html',
  styleUrl: './pill-tabs.component.scss',
})
export class PillTabsComponent {
  @Input() PillTabsConfig: PillTabsConfig = {
    mainTabs: {
      tabType: 'navigation',
      buttonContent: 'text',
      tabs: [],
    },
  };

  constructor(private router: Router, public elementRef: ElementRef) {}

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

  //    *ngIf="isAtLeastOneTabIsVisible(tabGroup.value)"
  // isAtLeastOneTabIsVisible(tabGroup: PillTabGroup | undefined): boolean {
  //   if (tabGroup == undefined) {
  //     return false;
  //   }

  //   return tabGroup.tabs.some((tabItem) => {
  //     if (tabItem.visibleIf && tabItem.visibleOn) {
  //       return tabItem.visibleIf() && this.isVisibleOnRoutes(tabItem.visibleOn);
  //     }

  //     if (tabItem.visibleIf && !tabItem.visibleOn) {
  //       return tabItem.visibleIf();
  //     }

  //     if (tabItem.visibleOn && !tabItem.visibleIf) {
  //       return this.isVisibleOnRoutes(tabItem.visibleOn);
  //     }

  //     return false;
  //   });
  // }

  isVisibleIf(callback: () => boolean): boolean {
    return callback();
  }

  isInTabTypes(
    tabTypes: TabButtonContent[],
    tabType: TabButtonContent
  ): boolean {
    return tabTypes.indexOf(tabType) != -1 ? true : false;
  }

  handleTabClick(callback: (() => void) | undefined) {
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
