import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TmdbService } from '../../../../shared/services/tmdb/tmdb.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Movie } from '../../../../shared/interfaces/models/tmdb/Movies';
import { ListInfo } from '../../../lists/feature/lists-home.component';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsService {
  private router = inject(Router);
  private tmdbService = inject(TmdbService);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMovieRoute) {
          this.updateCurrentMovie();
        }
      });
  }

  idFromRoute: IdFromRoute = null;
  fetchedMovieId: number | null = null;
  private fetchedSeriesId: number | null = null;

  private _movieData$ = new BehaviorSubject<Movie | null>(null);
  movieData$: Observable<Movie | null> = this._movieData$.asObservable();

  viewMovieDetails(id: number, title: string, listInfo?: ListInfo) {
    const titleSlugified = ('-' + title)
      .replace(/[^\p{L}\p{N}-]/giu, '-')
      .replace(/-{2,}/g, '-')
      .toLowerCase();

    this._movieData$.next(null);

    if (listInfo) {
      const { sourceType, sourceName, sourceID, listID, listName } = listInfo;

      const sourceIdAndName = sourceName
        ? `${sourceID}-${sourceName.toLocaleLowerCase()}`
        : sourceName;

      const listIDAndName = `${listID}-${listName.toLowerCase()}`;

      this.router.navigateByUrl(
        `/lists/${sourceType}/${sourceIdAndName}/${listIDAndName}/movie/${id}${titleSlugified}`,
      );
      return;
    }
    this.router.navigateByUrl(`/movie/${id}${titleSlugified}`);
  }

  get isMovieRoute(): boolean {
    return /\/movie\//.test(this.router.url);
  }

  private updateCurrentMovie() {
    const urlSegments = this.router.url.split('/');
    let titleId: number | null = null;

    if (this.router.url.includes('/lists/')) {
      titleId = parseInt(urlSegments[6].match(/^\d+/)?.[0] || '', 10);
    } else {
      titleId = parseInt(urlSegments[2].match(/^\d+/)?.[0] || '', 10);
    }

    this.idFromRoute = titleId;

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
        'no movie id found on route',
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
