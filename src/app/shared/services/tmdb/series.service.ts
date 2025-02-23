import { Injectable, inject } from '@angular/core';
import {
  Observable,
  of,
  retry,
  shareReplay,
  tap,
  catchError,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Season,
  Series,
  SeriesSummaryResults,
  TrendingSeries,
} from '../../interfaces/models/tmdb/Series';
import { TmdbConfigService } from './tmdb-config.service';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private http = inject(HttpClient);
  private tmdbConfig = inject(TmdbConfigService);

  private cachedSeries: { [key: string]: Observable<Series> } = {};
  private cachedTrendingSeries!: Observable<TrendingSeries>;
  private cachedSeriesSeasons: {
    [seriesId: string]: { [seasonNumber: string]: Observable<Season> };
  } = {};
  private cachedSeriesFromProviders: {
    [key: string]: Observable<SeriesSummaryResults>;
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
          catchError((err) =>
            this.handleError(err, 'Failed to fetch season details'),
          ),
        );
    }

    return this.cachedSeriesSeasons[seriesIdString][seasonNumberString];
  }

  getSeriesDetails(seriesId: number): Observable<Series> {
    const seriesIdString = seriesId.toString();
    if (!this.cachedSeries[seriesIdString]) {
      this.cachedSeries[seriesIdString] = this.http
        .get<Series>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews&include_image_language=en,null`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((series: Series) => {
            // Store the series data in the cache
            this.cachedSeries[seriesIdString] = of(series);
          }),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch series details'),
          ),
        );
    }
    return this.cachedSeries[seriesIdString];
  }

  getPopularSeries$(): Observable<SeriesSummaryResults> {
    if (!this.cachedTrendingSeries) {
      this.cachedTrendingSeries = this.http
        .get<TrendingSeries>(
          `${this.tmdbConfig.baseUrl}/tv/popular?language=en-US`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((result: TrendingSeries) => {
            // Store the fetched trending series data in the cache.
            this.cachedTrendingSeries = of(result);
          }),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch popular series'),
          ),
        );
    }
    return this.cachedTrendingSeries;
  }

  getSeriesFromWatchProvider$(
    providerId: number,
    page: number = 1,
  ): Observable<SeriesSummaryResults> {
    const cacheKey = `${providerId}-page-${page}`;
    if (!this.cachedSeriesFromProviders[cacheKey]) {
      const url = `${this.tmdbConfig.baseUrl}/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=${this.tmdbConfig.localCountryCode}&with_watch_providers=${providerId}`;

      // Fetch and cache series from a specific provider
      this.cachedSeriesFromProviders[cacheKey] = this.http
        .get<SeriesSummaryResults>(url)
        .pipe(
          retry(2),
          shareReplay(1),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch series from watch provider'),
          ),
        );
    }

    return this.cachedSeriesFromProviders[cacheKey];
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => error); // Re-throw for global error handling
  }
}
