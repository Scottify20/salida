import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from '../../interfaces/models/tmdb/Movies';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { Series } from '../../interfaces/models/tmdb/Series';
import {
  Country,
  TmdbTimeWindow,
  TrendingTitles,
} from '../../interfaces/models/tmdb/All';
import { TmdbConfigService } from './tmdb-config.service';
import { SeriesService } from './series.service';
import { MovieService } from './movie.service';
import { PeopleService } from './people.service';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  // params = new HttpParams().set('movies', '');

  // tmdb(baseUrl: string = this.baseUrl, params: HttpParams = this.params) {
  //   return this.http.get<any>(this.baseUrl, { params });
  // }

  constructor(
    private http: HttpClient,
    public series: SeriesService,
    public movies: MovieService,
    public people: PeopleService,
    private tmdbConfig: TmdbConfigService
  ) {}
  private cachedTrendingTitles!: Observable<TrendingTitles>;

  getTrendingTitles(timeWindow: TmdbTimeWindow): Observable<TrendingTitles> {
    if (!this.cachedTrendingTitles) {
      this.cachedTrendingTitles = this.http
        .get<TrendingTitles>(
          `${this.tmdbConfig.baseUrl}/trending/all/${timeWindow}`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((result: TrendingTitles) => {
            // Store the fetched trending series data in the cache.
            this.cachedTrendingTitles = of(result);
          })
        );
    }
    return this.cachedTrendingTitles;
  }
}
