import { Injectable } from '@angular/core';
import { TmdbConfigService } from './tmdb-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MultiSearchSummaryResults } from '../../interfaces/models/tmdb/All';
import { catchError, Observable, retry, shareReplay, throwError } from 'rxjs';
import { MovieSummaryResults } from '../../interfaces/models/tmdb/Movies';
import { SeriesSummaryResults } from '../../interfaces/models/tmdb/Series';
import { PersonSummaryResults } from '../../interfaces/models/tmdb/People';

export interface SearchParams {
  page: number;
  query: string;
  language: string;
  includeAdult: boolean;
  year?: string;
  primaryReleaseYear?: string;
  firstAirDateYear?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SearchAndDiscoverService {
  constructor(
    private tmdbConfig: TmdbConfigService,
    private httpClient: HttpClient,
  ) {}

  searchAll({
    page,
    query,
    language,
    includeAdult,
  }: SearchParams): Observable<MultiSearchSummaryResults> {
    let params = new HttpParams();

    includeAdult
      ? (params = params.set('include_adult', 'true'))
      : (params = params.set('include_adult', 'false'));
    query ? (params = params.set('query', query)) : null;
    page ? (params = params.set('page', page.toString())) : null;
    language ? (params = params.set('language', language)) : null;

    const url = `${this.tmdbConfig.baseUrl}/search/multi?${params.toString()}`;

    return this.httpClient.get<MultiSearchSummaryResults>(url).pipe(
      retry(2),
      shareReplay(1),
      catchError((err) =>
        this.handleError(err, 'Failed to search for: ' + query),
      ),
    );
  }

  searchMovies({
    page,
    query,
    language,
    includeAdult,
    year,
    primaryReleaseYear,
  }: SearchParams): Observable<MovieSummaryResults> {
    let params = new HttpParams();

    includeAdult ? (params = params.set('include_adult', 'true')) : null;
    query ? (params = params.set('query', query)) : null;
    page ? (params = params.set('page', page.toString())) : null;
    language ? (params = params.set('language', language)) : null;
    primaryReleaseYear
      ? (params = params.set('primary_release_year', primaryReleaseYear))
      : null;
    year ? (params = params.set('year', year)) : null;

    const url = `${this.tmdbConfig.baseUrl}/search/movie?${params.toString()}`;

    return this.httpClient.get<MovieSummaryResults>(url).pipe(
      retry(2),
      shareReplay(1),
      catchError((err) =>
        this.handleError(err, 'Failed to search for movie named: ' + query),
      ),
    );
  }

  searchSeries({
    page,
    query,
    language,
    includeAdult,
    year,
    firstAirDateYear,
  }: SearchParams): Observable<SeriesSummaryResults> {
    let params = new HttpParams();

    includeAdult ? (params = params.set('include_adult', 'true')) : null;
    query ? (params = params.set('query', query)) : null;
    page ? (params = params.set('page', page.toString())) : null;
    language ? (params = params.set('language', language)) : null;
    firstAirDateYear
      ? (params = params.set('first_air_date_year', firstAirDateYear))
      : null;
    year ? (params = params.set('year', year)) : null;

    const url = `${this.tmdbConfig.baseUrl}/search/tv?${params.toString()}`;

    return this.httpClient.get<SeriesSummaryResults>(url).pipe(
      retry(2),
      shareReplay(1),
      catchError((err) =>
        this.handleError(err, 'Failed to search for movie named: ' + query),
      ),
    );
  }

  searchPerson({
    page,
    query,
    language,
    includeAdult,
  }: SearchParams): Observable<PersonSummaryResults> {
    let params = new HttpParams();

    includeAdult ? (params = params.set('include_adult', 'true')) : null;
    query ? (params = params.set('query', query)) : null;
    page ? (params = params.set('page', page.toString())) : null;
    language ? (params = params.set('language', language)) : null;

    const url = `${this.tmdbConfig.baseUrl}/search/person?${params.toString()}`;

    return this.httpClient.get<PersonSummaryResults>(url).pipe(
      retry(2),
      shareReplay(1),
      catchError((err) =>
        this.handleError(err, 'Failed to search for person named: ' + query),
      ),
    );
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => error); // Re-throw for global error handling
  }
}
