import { DOCUMENT } from '@angular/common';
import { Component, Renderer2, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  routesWhereNavShows: string[] = ['/', '/lists', '/lists/**', '/search'];

  navItems: {
    label: string;
    iconSvgPathSolid: string;
    iconSvgPathOutline: string;
    routerPath: string;
    exact: boolean;
  }[] = [
    {
      label: 'Home',
      iconSvgPathSolid: `/assets/icons/nav/Home-solid.svg`,
      iconSvgPathOutline: '/assets/icons/nav/Home-outline.svg',
      routerPath: '/',
      exact: true,
    },
    {
      label: 'Lists',
      iconSvgPathSolid: `/assets/icons/nav/Lists-solid.svg`,
      iconSvgPathOutline: '/assets/icons/nav/Lists-outline.svg',
      routerPath: '/lists',
      exact: false,
    },
    {
      label: 'Search',
      iconSvgPathSolid: `/assets/icons/nav/Search-solid.svg`,
      iconSvgPathOutline: '/assets/icons/nav/Search-outline.svg',
      routerPath: '/search',
      exact: false,
    },
  ];

  showNavBar(): boolean {
    const currentUrl = this.router.url;
    return this.routesWhereNavShows.some((route) => {
      if (route.endsWith('**')) {
        // Check for wildcard
        const baseRoute = route.slice(0, -2); // Remove wildcard
        return currentUrl.startsWith(baseRoute);
      } else {
        return currentUrl === route;
      }
    });
  }

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

  ngOnInit() {
    // Preload icon SVGs on the navbar
    this.navItems.forEach((item) => {
      const link = this.renderer.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = item.iconSvgPathSolid;
      this.renderer.appendChild(this.document.head, link);

      const outlineLink = this.renderer.createElement('link');
      outlineLink.rel = 'prefetch';
      outlineLink.as = 'image';
      outlineLink.href = item.iconSvgPathOutline;
      this.renderer.appendChild(this.document.head, outlineLink);
    });
  }
}
