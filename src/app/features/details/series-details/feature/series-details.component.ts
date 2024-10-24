import { Component, DestroyRef } from '@angular/core';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import { RouterOutlet } from '@angular/router';
import {
  ReviewsPreferences,
  TemporaryUserPreferencesService,
} from '../../../../shared/services/preferences/temporary-user-preferences-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownPickerTabComponent } from '../../../../shared/components/tabs/dropdown-picker-tab/dropdown-picker-tab.component';
import { DropDownPickerTabProps } from '../../../../shared/components/tabs/dropdown-picker-tab/dropdown-picker-tab.interface';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';
import { SeasonsComponent } from '../ui/series-details/seasons/seasons.component';
import { SeriesMoreDetailsComponent } from '../ui/series-details/series-more-details/series-more-details.component';
import { SeriesDetailsService } from '../data-access/series-details.service';

@Component({
  selector: 'app-series-details',
  standalone: true,
  imports: [
    MediaHeroSectionComponent,
    RouterOutlet,
    DropdownPickerTabComponent,
    PillIndexedTabsComponent,
    ReviewsComponent,
    SeasonsComponent,
    SeriesMoreDetailsComponent,
  ],
  templateUrl: '../ui/series-details/series-details.component.html',
  styleUrl: '../ui/series-details/series-details.component.scss',
})
export class SeriesDetailsComponent {
  constructor(
    private preferencesService: TemporaryUserPreferencesService,
    private destroyRef: DestroyRef,
    protected seriesDetailsService: SeriesDetailsService,
  ) {
    this.preferencesService.preferences$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((preferences) => {
          this.reviewsPreferences =
            preferences.details.movieAndSeriesDetails.reviews;
        }),
      )
      .subscribe();
  }

  private reviewsPreferences: ReviewsPreferences = {};

  previousTabIndex: number | null = null;
  currentTabIndex: number = 0;

  setTabIndex(index: number) {
    this.previousTabIndex = Number(this.currentTabIndex);
    this.currentTabIndex = index;
  }

  dropDownPickerTabProps: DropDownPickerTabProps = {
    id: 'season-picker-dropdown-tab',
    text: this.seriesDetailsService.selectedSeason || '',
    callback: () => {
      this.seriesDetailsService.isSeriesPickerShown$.next(true);
    },
    visibleIf: () => {
      return false;
    },
  };

  pillIndexedTabsProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [
      {
        text: 'Details',
      },
      {
        text: 'Episodes',
      },
      {
        text: 'Reviews',
      },
    ],
  };
}
