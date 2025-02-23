import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { SearchBarComponent } from '../ui/search-bar/search-bar.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';

import { MediaResultCardComponent } from '../ui/media-result-card/media-result-card.component';
import {
  SearchPageService,
  SearchType,
} from '../data-access/search-page.service';
import { PersonResultCardComponent } from '../ui/person-result-card/person-result-card.component';
import { IntersectionObserverService } from '../../../shared/services/dom/intersection-observer.service';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CategoryChipComponent,
  CategoryChipProps,
} from '../ui/category-chip/category-chip.component';
import { ResultCardSkeletonComponent } from '../ui/result-card-skeleton/result-card-skeleton.component';

@Component({
  selector: 'app-search-home',
  imports: [
    SearchBarComponent,
    PillIndexedTabsComponent,
    MediaResultCardComponent,
    PersonResultCardComponent,
    CategoryChipComponent,
    ResultCardSkeletonComponent,
  ],
  templateUrl: '../ui/search-home.component.html',
  styleUrl: '../ui/search-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHomeComponent {
  protected searchTrigger$ = new Subject<string>();

  constructor(
    protected spService: SearchPageService,
    private intersectionObserver: IntersectionObserverService,
    private destroyRef: DestroyRef,
  ) {
    this.searchTrigger$
      .pipe(takeUntilDestroyed(this.destroyRef))
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
    swipeGestures: true,
    defaultTabIndex: computed(() => {
      return this.spService.getSearchTypeIndexInPillTabs(
        this.spService.searchParams.searchType(),
      );
    }),
    buttonContent: 'text',
    animationType: 'slide',
    tabs: [
      {
        text: 'All',
        onClickCallback: this.setSearchType('all'),
      },
      {
        text: 'Movies',
        onClickCallback: this.setSearchType('movie'),
      },
      {
        text: 'Series',
        onClickCallback: this.setSearchType('series'),
      },
      {
        text: 'People',
        onClickCallback: this.setSearchType('person'),
      },
    ],
  };

  setSearchType(type: SearchType) {
    return () => {
      this.spService.searchParams.searchType.set(type);
      window.scrollTo({ top: 0 });

      if (this.spService.isNoFirstPageResultsYet(type)) {
        this.searchTrigger$.next(this.spService.searchParams.all.query());
      }
    };
  }

  categoryChips: CategoryChipProps[] = [
    {
      label: 'Action',
      iconURL: '/assets/icons/search/catergory-chips/Action.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Adventure',
      iconURL: '/assets/icons/search/catergory-chips/Adventure.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Animation',
      iconURL: '/assets/icons/search/catergory-chips/Animation.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Biography',
      iconURL: '/assets/icons/search/catergory-chips/Biography.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Comedy',
      iconURL: '/assets/icons/search/catergory-chips/Comedy.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Crime',
      iconURL: '/assets/icons/search/catergory-chips/Crime.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Documentary',
      iconURL: '/assets/icons/search/catergory-chips/Documentary.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Drama',
      iconURL: '/assets/icons/search/catergory-chips/Drama.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Fantasy',
      iconURL: '/assets/icons/search/catergory-chips/Fantasy.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'History',
      iconURL: '/assets/icons/search/catergory-chips/History.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Horror',
      iconURL: '/assets/icons/search/catergory-chips/Horror.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Korean',
      iconURL: '/assets/icons/search/catergory-chips/Korean.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Mystery',
      iconURL: '/assets/icons/search/catergory-chips/Mystery.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Romance',
      iconURL: '/assets/icons/search/catergory-chips/Romance.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Sci - Fi',
      iconURL: '/assets/icons/search/catergory-chips/Sci-Fi.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Thriller',
      iconURL: '/assets/icons/search/catergory-chips/Thriller.svg',
      onClick: () => {
        return;
      },
    },
    {
      label: 'Western',
      iconURL: '/assets/icons/search/catergory-chips/Western.svg',
      onClick: () => {
        return;
      },
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
}
