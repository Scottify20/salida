import {
  Component,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
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
export class MovieDetailsComponent implements AfterViewInit {
  constructor(private preferencesService: TemporaryUserPreferencesService) {}

  previousTabIndex: number | null = null;
  currentTabIndex: number = 0;

  setTabIndex(index: number) {
    this.previousTabIndex = Number(this.currentTabIndex);
    this.currentTabIndex = index;
  }

  pillIndexedTabsProps: PillIndexedTabsProps = {
    swipeGestures: true,
    buttonContent: 'text',
    animationType: 'slide',
    tabs: [
      {
        text: 'Details',
        onClickCallback: this.scrollToPillTabs,
      },
      {
        text: 'Cast + Crew',
        onClickCallback: this.scrollToPillTabs,
      },
      {
        text: 'Reviews',
        onClickCallback: this.scrollToPillTabs,
      },
      {
        text: 'Releases',
        onClickCallback: this.scrollToPillTabs,
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
          this.scrollToPillTabs();
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
          this.scrollToPillTabs();
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
          this.scrollToPillTabs();
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
          this.scrollToPillTabs();
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
          this.scrollToPillTabs();
        },
        isActive: computed(
          () =>
            this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource() ===
            'tmdb',
        ),
        iconPathActive: '/assets/icons/toggle_switch/reviews/tmdb_active.svg',
        iconPathDisabled:
          '//assets/icons/toggle_switch/reviews/tmdb_inactive.svg',
      },
      {
        onClick: () => {
          this.preferencesService.preferences.details.movieAndSeriesDetails.reviews.reviewsSource.set(
            'salida',
          );
          this.scrollToPillTabs();
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

  @ViewChild('pillTabs') pillTabs!: ElementRef;
  @ViewChild('heroSectionCont') heroSection!: ElementRef;

  ngAfterViewInit() {
    this.pillIndexedTabsProps.tabs.forEach((tab) => {
      tab.onClickCallback = this.scrollToPillTabs.bind(this);
    });
  }

  scrollToPillTabs() {
    const hero = this.heroSection.nativeElement as HTMLElement;

    const offset = hero.offsetHeight - this.getRem() * (3.98 - 1);

    if (this.pillTabs && window.scrollY > offset) {
      window.scrollTo({
        top: offset,
      });
    }
  }

  // Gets the computed font size of the document's root element in pixels.
  private getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}
