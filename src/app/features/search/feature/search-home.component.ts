import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { SearchBarComponent } from '../ui/search-bar/search-bar.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';

import { MediaResultCardComponent } from '../ui/media-result-card/media-result-card.component';
import { SearchPageService } from '../data-access/search-page.service';
import { PersonResultCardComponent } from '../ui/person-result-card/person-result-card.component';
import { IntersectionObserverService } from '../../../shared/services/dom/intersection-observer.service';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-home',
  imports: [
    SearchBarComponent,
    PillIndexedTabsComponent,
    MediaResultCardComponent,
    PersonResultCardComponent,
  ],
  templateUrl: '../ui/search-home.component.html',
  styleUrl: '../ui/search-home.component.scss',
})
export class SearchHomeComponent {
  protected searchTrigger$ = new Subject<string>();

  // TODO
  // the genres are still numbers
  // blank posters
  // sticky search bar and tabs
  // back button?
  // categories
  // role label for people results

  constructor(
    protected spService: SearchPageService,
    private intersectionObserver: IntersectionObserverService,
    private destroyRef: DestroyRef,
  ) {
    this.searchTrigger$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe((query) => this.spService.triggerSearch(query));
  }

  @ViewChild('bottomIntersectionElement')
  bottomIntersectionRef!: ElementRef;

  bottomIntersectionElement!: HTMLDivElement;

  // for maintaining the value even if the user leaves the search page
  defaultSearchValue = this.spService.searchParams.all.query;

  ngAfterViewInit() {
    this.startResultsBottomObserver();
  }

  ngOnDestroy() {
    this.intersectionObserver.unobserve(this.bottomIntersectionElement);
  }

  // intersection observer for the bottom of the results
  // triggers search for more search results pages
  startResultsBottomObserver() {
    const element = this.bottomIntersectionRef.nativeElement as HTMLDivElement;
    this.bottomIntersectionElement = element;

    const options = { rootMargin: '600px' };

    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      const currentSearchType = this.spService.searchParams.searchType();

      if (
        this.spService.isNoFirstPageResultsYet(currentSearchType) ||
        !entries[0].isIntersecting
      ) {
        return;
      }

      this.searchTrigger$.next(this.spService.searchParams.all.query());
    };

    this.intersectionObserver.observe(element, intersectionCallback, options);
  }

  pillTabsProps: PillIndexedTabsProps = {
    defaultTabIndex: computed(() => {
      return this.spService.getSearchTypeIndexInPillTabs(
        this.spService.searchParams.searchType(),
      );
    }),
    buttonContent: 'text',
    animationType: 'fade',
    tabs: [
      {
        text: 'All',
        onClickCallback: () => {
          this.spService.searchParams.searchType.set('all');

          if (this.spService.isNoFirstPageResultsYet('all')) {
            this.searchTrigger$.next(this.spService.searchParams.all.query());
          }
        },
      },
      {
        text: 'Movies',
        onClickCallback: () => {
          this.spService.searchParams.searchType.set('movie');

          if (this.spService.isNoFirstPageResultsYet('movie')) {
            this.searchTrigger$.next(this.spService.searchParams.all.query());
          }
        },
      },
      {
        text: 'Series',
        onClickCallback: () => {
          this.spService.searchParams.searchType.set('series');

          if (this.spService.isNoFirstPageResultsYet('series')) {
            this.searchTrigger$.next(this.spService.searchParams.all.query());
          }
        },
      },
      {
        text: 'People',
        onClickCallback: () => {
          this.spService.searchParams.searchType.set('person');

          if (this.spService.isNoFirstPageResultsYet('person')) {
            this.searchTrigger$.next(this.spService.searchParams.all.query());
          }
        },
      },
    ],
  };
}
