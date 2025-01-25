import { Component, DestroyRef } from '@angular/core';
import { Season } from '../../../../../../shared/interfaces/models/tmdb/Series';

import { catchError, map, of, tap } from 'rxjs';
import { SeriesDetailsService } from '../../../data-access/series-details.service';
import { EpisodeGroupComponent } from '../episode-group/episode-group.component';
import { CommonModule } from '@angular/common';
import {
  PopupItem,
  PopupOrBottomSheetComponent,
  PopupOrBottomSheetConfig,
} from '../../../../../../shared/components/popup-or-bottom-sheet/popup-or-bottom-sheet.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EpisodeCardSkeletonComponent } from '../../episode-card-skeleton/episode-card-skeleton.component';

@Component({
  imports: [
    EpisodeGroupComponent,
    CommonModule,
    PopupOrBottomSheetComponent,
    EpisodeCardSkeletonComponent,
  ],
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
  ) {
    this.initiateSeasonDataAndPicker();
  }

  seasonPickerConfig: PopupOrBottomSheetConfig = {
    anchorElementId: 'season-picker-dropdown-tab',
    itemsType: 'texts',
    items: [],
    isPopupShown: this.seriesDetailsService.isSeriesPickerShown,
  };

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

  selectedSeason: string | null = null;
  isLoading = true;
  isFetchingFailed = false;

  initiateSeasonDataAndPicker() {
    this.seriesDetailsService.seasonsSummary$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((seasons) => {
          if (!seasons[0]) {
            return;
          }

          this.seasonPickerConfig.items = [...seasons].map((season) => {
            const seasonName = String(season.name);

            const popUpItemConfig: PopupItem = {
              textContent: seasonName,
              callback: () => {
                this.isLoading = true;

                this.seriesDetailsService.selectedSeasonSummary$.next({
                  ...season,
                });
                this.seriesDetailsService.isSeriesPickerShown.set(false);
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

    this.seriesDetailsService.selectedSeasonSummary$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((seasonSummary) => {
          if (!seasonSummary) {
            return;
          }
          this.selectedSeason = seasonSummary.name;
        }),
      )
      .subscribe();

    this.seriesDetailsService.selectedSeasonData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
  ngOnDestroy() {
    this.seriesDetailsService.isSeriesPickerShown.set(null);
  }
}
