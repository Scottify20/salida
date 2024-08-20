import { Injectable } from '@angular/core';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Season, Series } from '../../interfaces/tmdb/Series';
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

  private cachedSeriesSeasons: {
    [seriesId: string]: { [seasonNumber: string]: Observable<Season> };
  } = {};

  getSeasonDetails(seriesId: number, seasonNumber: number): Observable<Season> {
    const seriesIdString = seriesId.toString();
    const seasonNumberString = seasonNumber.toString();

    this.cachedSeriesSeasons[seriesIdString] = {};

    const seasonExists = (): boolean => {
      return this.cachedSeriesSeasons &&
        this.cachedSeriesSeasons[seriesIdString] &&
        this.cachedSeriesSeasons[seriesIdString][seasonNumberString]
        ? true
        : false;
    };

    if (!seasonExists()) {
      this.cachedSeriesSeasons[seriesIdString][seasonNumberString] = this.http
        .get<Season>(
          `${this.tmdbConfig.baseUrl}/tv/${seriesIdString}/season/${seasonNumberString}`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((season: Season) => {
            this.cachedSeriesSeasons[seriesIdString][seasonNumberString] =
              of(season);
          })
        );
    }

    return this.cachedSeriesSeasons[seriesIdString][seasonNumberString];
  }

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
}
