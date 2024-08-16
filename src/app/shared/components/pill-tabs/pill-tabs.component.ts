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
  @Input() tabItems: PillTabItems = {
    mainTabs: {
      buttonType: 'text',
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

  isVisibleIf(callback: () => boolean): boolean {
    return callback();
  }

  handleTabClick(callback: (() => void) | undefined) {
    if (callback) {
      callback();
    }
  }
}

export interface PillTabItems {
  leftTabsOuter?: {
    buttonType: 'text' | 'icon';
    tabs: TabItem[];
  };
  leftTabsInner?: {
    buttonType: 'text' | 'icon';
    tabs: TabItem[];
  };
  mainTabs: {
    buttonType: 'text' | 'icon';
    tabs: TabItem[];
  };
  rightTabsInner?: {
    buttonType: 'text' | 'icon';
    tabs: TabItem[];
  };
  rightTabsOuter?: {
    buttonType: 'text' | 'icon';
    tabs: TabItem[];
  };

  [key: string]:
    | {
        buttonType: 'text' | 'icon';
        tabs: TabItem[];
      }
    | undefined;
}

interface TabItem {
  text?: string;
  iconPathActive?: string;
  iconPathDisabled?: string;
  routerLinkPath?: string;
  callback?: () => void;
  visibleOn: string[] | ['all']; // 'all' | 'movies' | 'series' | 'movies\\d+/releases' | etc.
  visibleIf?: () => boolean;
  isSelected?: () => boolean;
}
