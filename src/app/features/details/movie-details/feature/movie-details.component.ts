import { Component, computed } from '@angular/core';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import { TemporaryUserPreferencesService } from '../../../../shared/services/preferences/temporary-user-preferences-service';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { MovieMoreDetailsComponent } from '../ui/movie-details/movie-more-details/movie-more-details.component';
import { ReleasesComponent } from '../ui/movie-details/releases/releases.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';
import { CastAndCrewComponent } from '../../shared/ui/cast-and-crew/cast-and-crew.component';
import {
  ToggleSwitchComponent,
  ToggleSwitchProps,
} from '../../../../shared/components/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    MediaHeroSectionComponent,
    PillIndexedTabsComponent,
    MovieMoreDetailsComponent,
    ReleasesComponent,
    ReviewsComponent,
    CastAndCrewComponent,
    ToggleSwitchComponent,
  ],
  templateUrl: '../ui/movie-details/movie-details.component.html',
  styleUrl: '../ui/movie-details/movie-details.component.scss',
})
export class MovieDetailsComponent {
  constructor(private preferencesService: TemporaryUserPreferencesService) {}

  previousTabIndex: number | null = null;
  currentTabIndex: number = 0;

  setTabIndex(index: number) {
    this.previousTabIndex = Number(this.currentTabIndex);
    this.currentTabIndex = index;
  }

  pillIndexedTabsProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    animationType: 'slide',
    tabs: [
      {
        text: 'Details',
      },
      { text: 'Cast + Crew' },
      {
        text: 'Reviews',
      },
      {
        text: 'Releases',
      },
    ],
  };

  castOrCrewSwitchProps: ToggleSwitchProps = {
    buttonsContent: 'icon',
    buttons: [
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieAndSeriesDetails.castOrCrew.set(
            'cast',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieAndSeriesDetails.castOrCrew() ===
            'cast',
        ),
        iconPathActive:
          '/assets/icons/toggle_switch/cast_and_crew/cast_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/cast_and_crew/cast_inactive.svg',
      },
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieAndSeriesDetails.castOrCrew.set(
            'crew',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieAndSeriesDetails.castOrCrew() ===
            'crew',
        ),
        iconPathActive:
          '/assets/icons/toggle_switch/cast_and_crew/crew_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/cast_and_crew/crew_inactive.svg',
      },
    ],
  };

  releaseTypeSwitchProps: ToggleSwitchProps = {
    buttonsContent: 'icon',
    buttons: [
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieDetails.releases.groupBy.set(
            'release-type',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieDetails.releases.groupBy() ===
            'release-type',
        ),
        iconPathActive:
          '/assets/icons/toggle_switch/releases/release_type_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/releases/release_type_inactive.svg',
      },
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieDetails.releases.groupBy.set(
            'country',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieDetails.releases.groupBy() ===
            'country',
        ),
        iconPathActive:
          '/assets/icons/toggle_switch/releases/country_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/releases/country_inactive.svg',
      },
    ],
  };

  reviewsSourceSwitchProps: ToggleSwitchProps = {
    buttonsContent: 'icon',
    buttons: [
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource.set(
            'tmdb',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource() ===
            'tmdb',
        ),
        iconPathActive: '/assets/icons/toggle_switch/reviews/tmdb_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/reviews/tmdb_inactive.svg',
      },
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource.set(
            'salida',
          );
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource() ===
            'salida',
        ),
        iconPathActive: '/assets/icons/toggle_switch/reviews/salida_active.svg',
        iconPathDisabled:
          '/assets/icons/toggle_switch/reviews/salida_inactive.svg',
      },
    ],
  };
}
