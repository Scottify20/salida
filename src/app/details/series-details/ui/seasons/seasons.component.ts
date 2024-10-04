import { Component, DestroyRef, ViewChild } from '@angular/core';
import { Season } from '../../../../shared/interfaces/models/tmdb/Series';

import { catchError, map, of, Subscription, switchMap, tap } from 'rxjs';
import { SeriesDetailsService } from '../../data-access/series-details.service';
import { EpisodeGroupComponent } from '../episode-group/episode-group.component';

import {
  PopupItem,
  PopupOrBottomSheetComponent,
  PopupOrBottomSheetConfig,
} from '../../../../shared/components/popup-or-bottom-sheet/popup-or-bottom-sheet.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [EpisodeGroupComponent, PopupOrBottomSheetComponent],
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
  ) {
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

  seasonPickerConfig: PopupOrBottomSheetConfig = {
    anchorElementId: 'season-picker-tab',
    itemsType: 'texts',
    items: [],
    isPopupShown$: this.seriesDetailsService.isSeriesPickerShown$,
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

  isLoading = false;
  isFetchingFailed = false;

  ngOnDestroy() {
    this.seriesDetailsService.isSeriesPickerShown$.next(null);
  }
}
