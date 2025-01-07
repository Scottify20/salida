import { Injectable } from '@angular/core';
import { TmdbConfigService } from './tmdb-config.service';
import { catchError, Observable, retry, shareReplay, throwError } from 'rxjs';
import {
  Movie,
  MoviesInThearesOrUpcoming,
  MovieSummaryResults,
} from '../../interfaces/models/tmdb/Movies';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(
    private http: HttpClient,
    private tmdbConfig: TmdbConfigService,
  ) {}

  // Caches for different types of movie data
  private cachedMovies: { [key: string]: Observable<Movie> } = {};
  private cachedPopularMovies: {
    [key: string]: Observable<MovieSummaryResults>;
  } = {};
  private cachedMoviesInTheatres: {
    [key: string]: Observable<MoviesInThearesOrUpcoming>;
  } = {};
  private cachedUpcomingMovies: {
    [key: string]: Observable<MoviesInThearesOrUpcoming>;
  } = {};
  private cachedMoviesFromProviders: {
    [key: string]: Observable<MovieSummaryResults>;
  } = {};

  getMovieDetails(movieId: number): Observable<Movie> {
    const movieIdString = movieId.toString();
    if (this.cachedMovies[movieIdString]) {
      return this.cachedMovies[movieIdString]; // Return cached observable if available
    }

    const url = `${this.tmdbConfig.baseUrl}/movie/${movieIdString}?append_to_response=images,videos,credits,external_ids,release_dates,keywords,recommendations,watch/providers,reviews`;

    this.cachedMovies[movieIdString] = this.http.get<Movie>(url).pipe(
      retry(2),
      shareReplay(1),
      catchError((err) =>
        this.handleError(err, 'Failed to fetch movie details'),
      ),
    );
    return this.cachedMovies[movieIdString];
  }

  getPopularMovies$(page: number = 1): Observable<MovieSummaryResults> {
    const cacheKey = `page-${page}`;
    if (!this.cachedPopularMovies[cacheKey]) {
      const url = `${this.tmdbConfig.baseUrl}/movie/popular?page=${page}&region=${this.tmdbConfig.localCountryCode}`;
      // Fetch popular movies and cache the observable by page
      this.cachedPopularMovies[cacheKey] = this.http
        .get<MovieSummaryResults>(url)
        .pipe(
          retry(2),
          shareReplay(1),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch popular movies'),
          ),
        );
    }
    return this.cachedPopularMovies[cacheKey];
  }

  getMoviesPlayingInTheares$(
    page: number = 1,
  ): Observable<MoviesInThearesOrUpcoming> {
    const cacheKey = `page-${page}`;
    if (!this.cachedMoviesInTheatres[cacheKey]) {
      const url = `${this.tmdbConfig.baseUrl}/movie/now_playing?language=en-US&page=${page}&region=${this.tmdbConfig.localCountryCode}`;
      // Fetch now playing movies and cache by page
      this.cachedMoviesInTheatres[cacheKey] = this.http
        .get<MoviesInThearesOrUpcoming>(url)
        .pipe(
          retry(2),
          shareReplay(1),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch movies playing in theatres'),
          ),
        );
    }
    return this.cachedMoviesInTheatres[cacheKey];
  }

  getUpcomingMovies$(page: number = 1): Observable<MoviesInThearesOrUpcoming> {
    const cacheKey = `page-${page}`;
    if (!this.cachedUpcomingMovies[cacheKey]) {
      const url = `${this.tmdbConfig.baseUrl}/movie/upcoming?language=en-US&page=${page}&region=${this.tmdbConfig.localCountryCode}`;
      // Fetch upcoming movies and cache by page
      this.cachedUpcomingMovies[cacheKey] = this.http
        .get<MoviesInThearesOrUpcoming>(url)
        .pipe(
          retry(2),
          shareReplay(1),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch upcoming movies'),
          ),
        );
    }
    return this.cachedUpcomingMovies[cacheKey];
  }

  getMoviesFromWatchProvider$(
    providerId: number,
    page: number = 1,
  ): Observable<MovieSummaryResults> {
    const cacheKey = `${providerId}-page-${page}`;
    if (!this.cachedMoviesFromProviders[cacheKey]) {
      const url = `${this.tmdbConfig.baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=${this.tmdbConfig.localCountryCode}&with_watch_providers=${providerId}`;

      // Fetch and cache movies from a specific provider
      this.cachedMoviesFromProviders[cacheKey] = this.http
        .get<MovieSummaryResults>(url)
        .pipe(
          retry(2),
          shareReplay(1),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch movies from watch provider'),
          ),
        );
    }

    return this.cachedMoviesFromProviders[cacheKey];
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => error); // Re-throw for global error handling
  }
}
