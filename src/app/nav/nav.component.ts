import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ScrollPositionService } from '../shared/services/scroll-position.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(
    private router: Router,
    private scrollPositionService: ScrollPositionService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  navItems: {
    label: string;
    iconSvgPathSolid: string;
    iconSvgPathOutline: string;
    routerPath: string;
    exact: boolean;
  }[] = [
    {
      label: 'Home',
      iconSvgPathSolid: `assets/icons/nav/Home-solid.svg`,
      iconSvgPathOutline: 'assets/icons/nav/Home-outline.svg',
      routerPath: '/',
      exact: true,
    },
    {
      label: 'Lists',
      iconSvgPathSolid: `assets/icons/nav/Lists-solid.svg`,
      iconSvgPathOutline: 'assets/icons/nav/Lists-outline.svg',
      routerPath: '/lists',
      exact: false,
    },
    {
      label: 'Search',
      iconSvgPathSolid: `assets/icons/nav/Search-solid.svg`,
      iconSvgPathOutline: 'assets/icons/nav/Search-outline.svg',
      routerPath: '/search',
      exact: false,
    },
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getIconPath(navItemIndex: number): string {
    const navItem = this.navItems[navItemIndex];
    const route = navItem.routerPath;

    return this.isActive(route)
      ? navItem.iconSvgPathSolid
      : navItem.iconSvgPathOutline;
  }

  navigateToRoute(route: string): void {
    const mainElement = this.document.querySelector('main');
    if (mainElement) {
      this.scrollPositionService.savePosition(
        this.router.url,
        mainElement.scrollTop
      );
    }

    this.router.navigateByUrl(route);
  }
}
