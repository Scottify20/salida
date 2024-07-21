import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(protected router: Router) {}

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

  navigateTo(path: string) {
    this.router.navigateByUrl(path); // Use router.navigateByUrl to trigger navigation
  }

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
}
