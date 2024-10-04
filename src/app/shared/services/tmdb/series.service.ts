import { Injectable } from '@angular/core';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Season,
  Series,
  TrendingSeries,
} from '../../interfaces/models/tmdb/Series';
import { TmdbConfigService } from './tmdb-config.service';
import { TmdbTimeWindow } from '../../interfaces/models/tmdb/All';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  constructor(
    private http: HttpClient,
    private tmdbConfig: TmdbConfigService,
  ) {}
  private cachedSeries: { [key: string]: Observable<Series> } = {};
  private cachedTrendingSeries!: Observable<TrendingSeries>;
  private cachedSeriesSeasons: {
    [seriesId: string]: { [seasonNumber: string]: Observable<Season> };
  } = {};

  getSeasonDetails(seriesId: number, seasonNumber: number): Observable<Season> {
    const seriesIdString = seriesId.toString();
    const seasonNumberString = seasonNumber.toString();

    if (!this.cachedSeriesSeasons[seriesIdString]) {
      this.cachedSeriesSeasons[seriesIdString] = {};
    }

    if (!this.cachedSeriesSeasons[seriesIdString][seasonNumberString]) {
      this.cachedSeriesSeasons[seriesIdString][seasonNumberString] = this.http
        .get<Season>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}/season/${seasonNumberString}`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((season: Season) => {
            // Store the fetched season data in the cache.
            this.cachedSeriesSeasons[seriesIdString][seasonNumberString] =
              of(season);
          }),
        );
    }

    return this.cachedSeriesSeasons[seriesIdString][seasonNumberString];
  }

  getSeriesDetails(seriesId: number): Observable<Series> {
    const seriesIdString = seriesId.toString();
    if (!this.cachedSeries[seriesIdString]) {
      return this.http
        .get<Series>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((series: Series) => {
            // Store the series data in the cache
            this.cachedSeries[seriesIdString] = of(series);
          }),
        );
    } else {
      // Return the cached observable
      return this.cachedSeries[seriesIdString];
    }
  }

  getTrendingSeries(timeWindow: TmdbTimeWindow): Observable<TrendingSeries> {
    if (!this.cachedTrendingSeries) {
      this.cachedTrendingSeries = this.http
        .get<TrendingSeries>(
          `${this.tmdbConfig.baseUrl}/trending/tv/${timeWindow}`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((result: TrendingSeries) => {
            // Store the fetched trending series data in the cache.
            this.cachedTrendingSeries = of(result);
          }),
        );
    }
    return this.cachedTrendingSeries;
  }
}
