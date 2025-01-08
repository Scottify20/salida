import { Component, computed, ElementRef, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../ui/search-bar/search-bar.component';
import { HeaderButtonProps } from '../../../shared/components/header-button/header-button.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';

import { MediaResultCardComponent } from '../ui/media-result-card/media-result-card.component';
import { SearchPageService } from '../data-access/search-page.service';
import { PersonResultCardComponent } from '../ui/person-result-card/person-result-card.component';
import { IntersectionObserverService } from '../../../shared/services/dom/intersection-observer.service';

@Component({
  selector: 'app-search-home',
  imports: [
    SearchBarComponent,
    PillIndexedTabsComponent,
    MediaResultCardComponent,
    PersonResultCardComponent,
  ],
  templateUrl: '../ui/search-home/search-home.component.html',
  styleUrl: '../ui/search-home/search-home.component.scss',
})
export class SearchHomeComponent {
  constructor(
    protected searchPageService: SearchPageService,
    private intersectionObserver: IntersectionObserverService,
  ) {}

  // must be refactored for long variable names and repeating reference to the search page service
  // the search feature is has bugs when changing the search queries, it doesn't reset the page
  // the search feature is has bugs when resubmitting the search input, it repeats the search appends duplicated results
  // the changes in filters should also be considered
  // the genres are still numbers
  // blank posters
  // sticky search bar and tabs
  // back button?
  // categories

  @ViewChild('bottomIntersectionElement')
  bottomIntersectionElement!: ElementRef;

  defaultSearchValue = this.searchPageService.searchPreferences.all.query;

  ngAfterViewInit() {
    this.startResultsBottomIntersectionObserver();
  }

  startResultsBottomIntersectionObserver() {
    const element = this.bottomIntersectionElement
      .nativeElement as HTMLDivElement;

    const options: IntersectionObserverInit = { rootMargin: '600px' };

    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      const currentSearchType =
        this.searchPageService.searchPreferences.searchType();

      let isNoFirstPageResultsYet =
        this.searchPageService.isNoFirstPageResultsYet(currentSearchType);

      if (isNoFirstPageResultsYet) {
        return;
      }

      this.triggerSearch(this.searchPageService.searchPreferences.all.query());
    };

    this.intersectionObserver.observe(element, intersectionCallback, options);
  }

  triggerSearch(query: string) {
    this.searchPageService.triggerSearch(query);
  }

  pillTabsProps: PillIndexedTabsProps = {
    defaultTabIndex: computed(() => {
      return this.searchPageService.getSearchTypeIndexInPillTabs(
        this.searchPageService.searchPreferences.searchType(),
      );
    }),
    buttonContent: 'text',
    animationType: 'none',
    tabs: [
      {
        text: 'All',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('all');

          if (this.searchPageService.isNoFirstPageResultsYet('all')) {
            this.triggerSearch(
              this.searchPageService.searchPreferences.all.query(),
            );
          }
        },
      },
      {
        text: 'Movies',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('movie');

          if (this.searchPageService.isNoFirstPageResultsYet('movie')) {
            this.triggerSearch(
              this.searchPageService.searchPreferences.all.query(),
            );
          }
        },
      },
      {
        text: 'Series',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('series');

          if (this.searchPageService.isNoFirstPageResultsYet('series')) {
            this.triggerSearch(
              this.searchPageService.searchPreferences.all.query(),
            );
          }
        },
      },
      {
        text: 'People',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('person');

          if (this.searchPageService.isNoFirstPageResultsYet('person')) {
            this.triggerSearch(
              this.searchPageService.searchPreferences.all.query(),
            );
          }
        },
      },
    ],
  };

  backButtonProps: HeaderButtonProps = {
    type: 'icon',
    iconPath: 'assets/icons/header/Back.svg',
  };
}
