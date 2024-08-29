import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MovieDetailsService } from '../data-access/movie-details.service';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import {
  PillTabsComponent,
  PillTabsConfig,
} from '../../../shared/components/pill-tabs/pill-tabs.component';
import {
  Preferences,
  TemporaryUserPreferencesService,
} from '../../../shared/services/preferences/temporary-user-preferences-service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [RouterOutlet, MediaHeroSectionComponent, PillTabsComponent],
  templateUrl: '../ui/movie-details/movie-details.component.html',
  styleUrl: '../ui/movie-details/movie-details.component.scss',
})
export class MovieDetailsComponent {
  constructor(
    private preferencesService: TemporaryUserPreferencesService,
    private movieDetailsService: MovieDetailsService
  ) {
    this.userPreferencesSubscriptions = this.preferencesService.preferences$
      .pipe(
        tap((preferences) => {
          if (!preferences) {
            return;
          }
          this.userPreferences = preferences;
        })
      )
      .subscribe();
  }

  private userPreferences!: Preferences;
  private userPreferencesSubscriptions: Subscription | null = null;
  ngOnDestroy() {
    this.userPreferencesSubscriptions?.unsubscribe();
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
          text: 'Releases',
          routerLinkPath: 'releases',
          visibleOn: ['movie/\\d+/'],
        },
        {
          text: 'Reviews',
          routerLinkPath: 'reviews',
          visibleOn: ['all'],
          visibleIf: () => {
            let hasReviews = false;
            this.movieDetailsService.movieData$.subscribe((movie) => {
              hasReviews = !!movie?.reviews.results.length;
            });
            return hasReviews;
          },
        },
      ],
    },

    rightTabs1: {
      tabType: 'toggle-switch',
      buttonContent: 'icon',
      tabs: [
        {
          iconPathActive: 'assets/icons/pill-tabs/Calendar-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Calender-grey.svg',
          callback: () => {
            this.userPreferences.details.movieDetails.releases.groupBy =
              'release-type';
          },
          isSelected: () => {
            return (
              this.userPreferences.details.movieDetails.releases.groupBy ==
              'release-type'
            );
          },
          visibleOn: ['movie/\\d+/releases'],
        },
        {
          iconPathActive: 'assets/icons/pill-tabs/Globe-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Globe-grey.svg',
          callback: () => {
            this.userPreferences.details.movieDetails.releases.groupBy =
              'country';
          },
          isSelected: () => {
            return (
              this.userPreferences.details.movieDetails.releases.groupBy ==
              'country'
            );
          },
          visibleOn: ['movie/\\d+/releases'],
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
              }
            );
          },
          isSelected: () => {
            return (
              this.userPreferences.details.movieAndSeriesDetails.reviews
                .reviewsSource == 'salida'
            );
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
              }
            );
          },
          isSelected: () => {
            return (
              this.userPreferences.details.movieAndSeriesDetails.reviews
                .reviewsSource == 'tmdb'
            );
          },
          visibleOn: ['reviews'],
        },
      ],
    },
  };
}
