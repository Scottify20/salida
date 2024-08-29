import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TmdbService } from '../../../shared/services/tmdb/tmdb.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Movie } from '../../../shared/interfaces/tmdb/Movies';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsService {
  constructor(private router: Router, private tmdbService: TmdbService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMovieRoute) {
          this.updateCurrentMovie();
        }
      });
  }

  idFromRoute: IdFromRoute = null;
  private fetchedSeriesId: number | null = null;

  private _movieData$ = new BehaviorSubject<Movie | null>(null);
  movieData$: Observable<Movie | null> = this._movieData$.asObservable();

  viewMovieDetails(id: number) {
    this.router.navigateByUrl(`/movie/${id}/details`);
  }

  fetchedMovieId: number | null = null;

  get isMovieRoute(): boolean {
    return /\/movie\//.test(this.router.url);
  }

  private updateCurrentMovie() {
    const urlSegments = this.router.url.split('/');
    const titleId = parseInt(urlSegments[2], 10);
    this.idFromRoute = titleId;

    if (!isNaN(titleId) && titleId == this.fetchedSeriesId) {
      return;
    }

    if (!isNaN(titleId) && this.isMovieRoute) {
      this.fetchCurrentMovieData();
    } else {
      this._movieData$.next(null);
    }
  }

  private fetchCurrentMovieData() {
    if (!this.idFromRoute) {
      console.log(
        'Error fetching movie details:',
        'no movie id found on route'
      );
      return;
    }

    this.tmdbService.movies.getMovieDetails(this.idFromRoute).subscribe({
      next: (movie) => {
        this._movieData$.next(movie);
        this.fetchedMovieId = movie.id;
      },
      error: (error) => {
        console.error('Error fetching movie details:', error);
        this._movieData$.next(null);
      },
    });
  }
}

export type IdFromRoute = null | number;
