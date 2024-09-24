import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeriesDetailsService } from '../data-access/series-details.service';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import {
  PillTabsComponent,
  PillTabsConfig,
} from '../../../shared/components/pill-tabs/pill-tabs.component';
import { RouterOutlet } from '@angular/router';
import { ScrollDisablerService } from '../../../shared/services/dom/scroll-disabler.service';
import {
  ReviewsPreferences,
  TemporaryUserPreferencesService,
} from '../../../shared/services/preferences/temporary-user-preferences-service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-series-details',
  standalone: true,
  imports: [MediaHeroSectionComponent, PillTabsComponent, RouterOutlet],
  templateUrl: '../ui/series-details/series-details.component.html',
  styleUrl: '../ui/series-details/series-details.component.scss',
})
export class SeriesDetailsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private scrollDisablerService: ScrollDisablerService,
    private preferencesService: TemporaryUserPreferencesService,
  ) {
    this.reviewsPreferencesSubscription = this.preferencesService.preferences$
      .pipe(
        tap((preferences) => {
          this.reviewsPreferences =
            preferences.details.movieAndSeriesDetails.reviews;
        }),
      )
      .subscribe();
  }

  private reviewsPreferences: ReviewsPreferences = {};
  private reviewsPreferencesSubscription: Subscription | null = null;
  ngOnDestroy() {
    this.reviewsPreferencesSubscription?.unsubscribe();
  }

  TitleDetailsTabConfig: PillTabsConfig = {
    navTabs: {
      tabType: 'navigation',
      buttonContent: 'text',
      tabs: [
        {
          text: 'Details',
          routerLinkPath: 'details',
          visibleOn: ['all'],
        },
        {
          text: 'Seasons',
          routerLinkPath: 'seasons',
          visibleOn: ['series'],
        },
        {
          text: 'Reviews',
          routerLinkPath: 'reviews',
          visibleOn: ['all'],
          visibleIf: () => {
            let hasReviews = false;
            this.seriesDetailsService.seriesData$.subscribe((series) => {
              hasReviews = !!series?.reviews.results.length;
            });
            return hasReviews;
          },
        },
      ],
    },

    rightTabs1: {
      tabType: 'toggle-switch',
      buttonContent: 'dynamic-text-then-icon',
      tabs: [
        {
          id: 'season-picker-tab',
          iconPathActive: 'assets/icons/pill-tabs/Arrow-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Arrow-grey.svg',
          dynamicText: () => {
            return this.seriesDetailsService.selectedSeason;
          },
          callback: () => {
            this.scrollDisablerService.disableBodyScroll(
              'season-picker-popup-or-bottom-sheet',
            );
            this.seriesDetailsService.isSeriesPickerShown$.next(true);
          },
          isSelected: () => {
            return true;
          },
          visibleOn: ['seasons'],
          visibleIf: () => {
            let hasMultipleSeasons = false;
            this.seriesDetailsService.seriesData$.subscribe((series) => {
              hasMultipleSeasons = !!series && series.number_of_seasons > 1;
            });
            return hasMultipleSeasons;
          },
        },
      ],
    },

    rightTabs2: {
      tabType: 'toggle-switch',
      buttonContent: 'icon',
      tabs: [
        {
          iconPathActive: 'assets/icons/pill-tabs/Salida-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Salida-grey.svg',
          callback: () => {
            this.preferencesService.updateMovieAndSeriesDetailsOverlapPreferences(
              {
                reviews: {
                  reviewsSource: 'salida',
                },
              },
            );
          },
          isSelected: () => {
            return this.reviewsPreferences.reviewsSource == 'salida';
          },
          visibleOn: ['reviews'],
        },
        {
          iconPathActive: 'assets/icons/pill-tabs/Tmdb-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Tmdb-grey.svg',
          callback: () => {
            this.preferencesService.updateMovieAndSeriesDetailsOverlapPreferences(
              {
                reviews: {
                  reviewsSource: 'tmdb',
                },
              },
            );
          },
          isSelected: () => {
            return this.reviewsPreferences.reviewsSource == 'tmdb';
          },
          visibleOn: ['reviews'],
        },
      ],
    },
  };
}
