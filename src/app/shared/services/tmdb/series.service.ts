import { Injectable } from '@angular/core';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Series } from '../../interfaces/tmdb/Series';
import { TmdbConfigService } from './tmdb-config.service';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  constructor(
    private http: HttpClient,
    private tmdbConfig: TmdbConfigService
  ) {}
  private cachedSeries: { [key: string]: Observable<Series> } = {};

  getSeriesDetails(seriesId: number): Observable<Series> {
    const seriesIdString = seriesId.toString();
    if (!this.cachedSeries[seriesIdString]) {
      this.cachedSeries[seriesIdString] = this.http
        .get<Series>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((series: Series) => {
            this.cachedSeries[seriesIdString] = of(series); // Wrap in of()
          })
        );
    }
    return this.cachedSeries[seriesIdString];
  }

  getSeasonDetails(seriesId: number, season: 'string'): Observable<Series> {
    const seriesIdString = seriesId.toString();
    if (!this.cachedSeries[seriesIdString]) {
      this.cachedSeries[seriesIdString] = this.http
        .get<Series>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((series: Series) => {
            this.cachedSeries[seriesIdString] = of(series); // Wrap in of()
          })
        );
    }
    return this.cachedSeries[seriesIdString];
  }
}
