import { Injectable } from '@angular/core';
import { TmdbConfigService } from './tmdb-config.service';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { Movie } from '../../interfaces/tmdb/Movies';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(
    private http: HttpClient,
    private tmdbConfig: TmdbConfigService
  ) {}

  private cachedMovies: { [key: string]: Observable<Movie> } = {};

  getMovieDetails(movieId: number): Observable<Movie> {
    const movieIdString = movieId.toString();
    if (!this.cachedMovies[movieIdString]) {
      this.cachedMovies[movieIdString] = this.http
        .get<Movie>(
          `${this.tmdbConfig.baseUrl}/movie/${movieIdString}?append_to_response=images,videos,credits,external_ids,release_dates,keywords,recommendations,watch/providers,reviews`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((movie: Movie) => {
            // Store the fetched movie data in the cache.
            this.cachedMovies[movieIdString] = of(movie); // Wrap in of()
          })
        );
    }
    return this.cachedMovies[movieIdString];
  }
}
