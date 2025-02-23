import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  signal,
  ViewChild,
  inject,
} from '@angular/core';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import { TemporaryUserPreferencesService } from '../../../../shared/services/preferences/temporary-user-preferences-service';
import {
  DropdownPickerTabComponent,
  DropDownPickerTabProps,
} from '../../../../shared/components/tabs/dropdown-picker-tab/dropdown-picker-tab.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';
import { SeasonsComponent } from '../ui/series-details/seasons/seasons.component';
import { SeriesMoreDetailsComponent } from '../ui/series-details/series-more-details/series-more-details.component';
import { SeriesDetailsService } from '../data-access/series-details.service';
import { CastAndCrewComponent } from '../../shared/ui/cast-and-crew/cast-and-crew.component';
import { FormatService } from '../../../../shared/services/utility/format.service';
import {
  ToggleSwitchProps,
  ToggleSwitchComponent,
} from '../../../../shared/components/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-series-details',
  imports: [
    MediaHeroSectionComponent,
    DropdownPickerTabComponent,
    PillIndexedTabsComponent,
    ReviewsComponent,
    SeasonsComponent,
    SeriesMoreDetailsComponent,
    CastAndCrewComponent,
    ToggleSwitchComponent,
  ],
  templateUrl: '../ui/series-details/series-details.component.html',
  styleUrl: '../ui/series-details/series-details.component.scss',
})
export class SeriesDetailsComponent {
  protected seriesDetailsService = inject(SeriesDetailsService);
  private formatService = inject(FormatService);
  private preferencesService = inject(TemporaryUserPreferencesService);

  constructor() {
    // Ensure the popup is hidden by default
    this.seriesDetailsService.isSeriesPickerShown.set(false);

    effect(() => {
      this.dropDownPickerTabProps.text = this.formatService.truncate(
        this.seriesDetailsService.selectedSeason(),
        6,
        '...',
        4,
      );
    });

    effect(() => {
      this.seriesDetailsService.isSeriesPickerShown() === true
        ? this.dropDownPickerTabProps.arrowDirection.set('up')
        : this.dropDownPickerTabProps.arrowDirection.set('down');
    });
  }

  previousTabIndex: number | null = null;
  currentTabIndex: number = 0;

  setTabIndex(index: number) {
    this.previousTabIndex = Number(this.currentTabIndex);
    this.currentTabIndex = index;

    // Hide the popup when switching tabs
    this.seriesDetailsService.isSeriesPickerShown.set(false);

    // Hide the popup when switching to the episodes tab (index 2)
    if (index === 2) {
      this.seriesDetailsService.isSeriesPickerShown.set(false);
    }
  }

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

  dropDownPickerTabProps: DropDownPickerTabProps = {
    id: 'season-picker-dropdown-tab',
    text: '---', // this needs to be updated by the effect in the constructor
    callback: () => {
      this.seriesDetailsService.isSeriesPickerShown.set(true);
    },
    arrowDirection: signal('down'),
  };

  pillIndexedTabsProps: PillIndexedTabsProps = {
    swipeGestures: true,
    buttonContent: 'text',
    animationType: 'slide',
    tabs: [
      {
        text: 'Details',
      },
      { text: 'Cast + Crew' },
      {
        text: 'Episodes',
      },
      {
        text: 'Reviews',
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
          '/assets/icons/toggle_switch/reviews/tmdb_inactive.svg',
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
}
