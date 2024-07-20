import { Directive, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  RouterOutlet,
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router'; // Import NavigationEnd
import { filter, pairwise, Subscription } from 'rxjs';
import { ScrollPositionService } from '../services/scroll-position.service';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: 'router-outlet[restoreScrollPosition]' })
export class RestoreScrollPositionDirective implements OnInit, OnDestroy {
  private routerOutletSubscription: Subscription | undefined;

  constructor(
    private routerOutlet: RouterOutlet,
    private scrollPositionService: ScrollPositionService,
    private activatedRoute: ActivatedRoute,
    private router: Router, // Inject Router
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.routerOutletSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd), // Filter for NavigationEnd
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        if (prev.url !== curr.url) {
          // Check if URLs are different
          const currentPosition = this.scrollPositionService.getPosition(
            curr.url
          );
          setTimeout(() => {
            this.document.querySelector('main')!.scrollTop = currentPosition;
          }, 0);
        }
      });
  }

  ngOnDestroy(): void {
    this.routerOutletSubscription?.unsubscribe();
  }
}
