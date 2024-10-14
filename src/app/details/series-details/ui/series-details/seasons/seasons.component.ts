import { Component, ViewChild } from '@angular/core';
import { Season } from '../../../../../shared/interfaces/models/tmdb/Series';

import { catchError, map, of, Subscription, switchMap, tap } from 'rxjs';
import { SeriesDetailsService } from '../../../data-access/series-details.service';
import { EpisodeGroupComponent } from '../episode-group/episode-group.component';
import { CommonModule } from '@angular/common';
import {
  PopupItem,
  PopupOrBottomSheetComponent,
  PopupOrBottomSheetConfig,
} from '../../../../../shared/components/popup-or-bottom-sheet/popup-or-bottom-sheet.component';

@Component({
  standalone: true,
  imports: [EpisodeGroupComponent, CommonModule, PopupOrBottomSheetComponent],
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent {
  constructor(private seriesDetailsService: SeriesDetailsService) {
    this.seasonSummariesForPickerSubscription =
      this.seriesDetailsService.seasonsSummary$
        .pipe(
          map((seasons) => {
            if (!seasons[0]) {
              return;
            }

            this.seasonPickerConfig.items = [...seasons].map((season) => {
              const seasonName = String(season.name);

              const popUpItemConfig: PopupItem = {
                textContent: seasonName,
                callback: () => {
                  this.seriesDetailsService.selectedSeasonSummary$.next({
                    ...season,
                  });
                },
                isSelected: () => {
                  return this.selectedSeason == seasonName;
                },
              };

              return popUpItemConfig;
            });
          }),
        )
        .subscribe();

    this.selectedSeasonSubscription =
      this.seriesDetailsService.selectedSeasonSummary$
        .pipe(
          tap((seasonSummary) => {
            if (!seasonSummary) {
              return;
            }
            this.selectedSeason = seasonSummary.name;
          }),
        )
        .subscribe();

    this.seasonDataSubscription = this.seriesDetailsService.selectedSeasonData$
      .pipe(
        tap((seasonData) => {
          if (!seasonData) {
            return;
          }
          this.seasonData = seasonData;
          this.isLoading = false;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      )
      .subscribe();
  }

  seasonPickerConfig: PopupOrBottomSheetConfig = {
    anchorElementId: 'season-picker-tab',
    itemsType: 'texts',
    items: [],
    isPopupShown$: this.seriesDetailsService.isSeriesPickerShown$,
  };

  seasonDataSubscription: Subscription | null = null;
  seasonData: Season = {
    _id: '',
    air_date: '',
    episodes: [],
    name: '',
    overview: '',
    id: 0,
    poster_path: '',
    season_number: 0,
    vote_average: 0,
    external_ids: {
      tvdb_id: 0,
    },
    images: {
      posters: [],
      backdrops: [],
      logos: [],
    },
  };

  seasonSummariesForPickerSubscription: Subscription | null = null;
  selectedSeasonSubscription: Subscription | null = null;
  selectedSeason: string | null = null;

  isLoading = false;
  isFetchingFailed = false;

  ngOnDestroy() {
    this.seasonSummariesForPickerSubscription?.unsubscribe();
    this.seriesDetailsService.isSeriesPickerShown$.next(null);
    this.selectedSeasonSubscription?.unsubscribe();
    this.seasonDataSubscription?.unsubscribe();
  }
}
