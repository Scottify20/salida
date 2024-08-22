import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from '../../interfaces/tmdb/Movies';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { Series } from '../../interfaces/tmdb/Series';
import { Country } from '../../interfaces/tmdb/All';
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
    private tmdbConfig: TmdbConfigService,
    public series: SeriesService,
    public movies: MovieService,
    public people: PeopleService
  ) {}

  baseUrl = this.tmdbConfig.baseUrl;

  localCountryCode = 'PH';
  private cachedCountries: Country[] = [];
  // private cachedMovies: { [key: string]: Observable<Movie> } = {};
  // private cachedSeries: { [key: string]: Observable<Series> } = {};

  getCountryCodes(): Observable<Country[]> {
    const countryCodes = this.cachedCountries;

    if (countryCodes[0]) {
      return of(countryCodes);
    } else {
      return this.http
        .get<Country[]>(`${this.baseUrl}/configuration/countries`)
        .pipe(
          retry(2),
          shareReplay(1),
          tap((countries: Country[]) => {
            this.cachedCountries = countries;
          })
        );
    }
  }

  // getSeriesDetails(seriesId: number): Observable<Series> {
  //   const seriesIdString = seriesId.toString();
  //   if (!this.cachedSeries[seriesIdString]) {
  //     this.cachedSeries[seriesIdString] = this.http
  //       .get<Series>(
  //         `${this.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews`
  //       )
  //       .pipe(
  //         retry(2),
  //         shareReplay(1),
  //         tap((series: Series) => {
  //           this.cachedSeries[seriesIdString] = of(series); // Wrap in of()
  //         })
  //       );
  //   }
  //   return this.cachedSeries[seriesIdString];
  // }

  // getSeasonDetails(seriesId: number, season: 'string'): Observable<Series> {
  //   const seriesIdString = seriesId.toString();
  //   if (!this.cachedSeries[seriesIdString]) {
  //     this.cachedSeries[seriesIdString] = this.http
  //       .get<Series>(
  //         `${this.baseUrl}/tv/${seriesIdString}?append_to_response=images,videos,aggregate_credits,external_ids,content_ratings,keywords,recommendations,watch/providers,reviews`
  //       )
  //       .pipe(
  //         retry(2),
  //         shareReplay(1),
  //         tap((series: Series) => {
  //           this.cachedSeries[seriesIdString] = of(series); // Wrap in of()
  //         })
  //       );
  //   }
  //   return this.cachedSeries[seriesIdString];
  // }

  // getMovieDetails(movieId: number): Observable<Movie> {
  //   const movieIdString = movieId.toString();
  //   if (!this.cachedMovies[movieIdString]) {
  //     this.cachedMovies[movieIdString] = this.http
  //       .get<Movie>(
  //         `${this.baseUrl}/movie/${movieIdString}?append_to_response=images,videos,credits,external_ids,release_dates,keywords,recommendations,watch/providers,reviews`
  //       )
  //       .pipe(
  //         retry(2),
  //         shareReplay(1),
  //         tap((movie: Movie) => {
  //           // Store the fetched movie data in the cache.
  //           this.cachedMovies[movieIdString] = of(movie); // Wrap in of()
  //         })
  //       );
  //   }
  //   return this.cachedMovies[movieIdString];
  // }
}
