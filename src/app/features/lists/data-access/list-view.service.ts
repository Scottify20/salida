import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { ListInfo, ListSourceType } from '../feature/lists-home.component';
import { MovieService } from '../../../shared/services/tmdb/movie.service';
import { MovieSummaryResults } from '../../../shared/interfaces/models/tmdb/Movies';
import { MovieDetailsService } from '../../details/movie-details/data-access/movie-details.service';
import { ListViewProps } from '../ui/list-view/list-view.component';

@Injectable({
  providedIn: 'root',
})
export class ListViewService {
  private router = inject(Router);
  private movieService = inject(MovieService);
  private movieDetailsService = inject(MovieDetailsService);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isListsRoute) {
          console.log('list route detected');
          this.updateCurrentList();
        }
      });
  }

  listIDFromRoute: null | number = null;
  sourceTypeFromRoute: ListSourceType | null = null;
  sourceIdFromRoute: number | null = null;
  sourceNameFromRoute: string | null = null;
  listNameFromRoute: string | null = null;

  private _listData$ = new BehaviorSubject<ListViewProps | null>(null);
  listData$: Observable<ListViewProps | null> = this._listData$.asObservable();

  get isListsRoute(): boolean {
    return /\/lists\//.test(this.router.url);
  }

  viewList(listInfo: ListInfo) {
    this._listData$.next(null);

    const { sourceType, sourceName, sourceID, listID, listName } = listInfo;

    const sourceIdAndName = sourceName
      ? `${sourceID}-${sourceName.toLocaleLowerCase()}`
      : sourceName;

    const listIDAndName = `${listID}-${listName.toLowerCase()}`;

    this.router.navigateByUrl(
      `/lists/${sourceType}/${sourceIdAndName}/${listIDAndName}`,
    );
  }

  private updateCurrentList = () => {
    const urlSegments = this.router.url.split('/');

    const validSourceTypes = ['user', 'provider', 'community'];

    const sourceType = urlSegments[2];
    const sourceID = parseInt(urlSegments[3].match(/^\d+/)?.[0] || '', 10);
    this.sourceNameFromRoute = urlSegments[3].split('-')[1] || urlSegments[3]; // this only sets the first word of the list's name
    const listId = parseInt(urlSegments[4].match(/^\d+/)?.[0] || '', 10);
    this.listNameFromRoute = urlSegments[4].split('-')[1] || urlSegments[4]; // this only sets the first word of the list's name
    console.log(`type: ${sourceType}`, `sID:${sourceID}`, `listID:${listId}`);

    if (
      (!isNaN(listId) || sourceType === 'provider') &&
      this.isListsRoute &&
      validSourceTypes.includes(sourceType) &&
      !isNaN(sourceID)
    ) {
      this.sourceTypeFromRoute = sourceType as ListSourceType;
      this.sourceIdFromRoute = sourceID;
      this.listIDFromRoute = listId;

      this.fetchCurrentListData();
    } else {
      console.log('invalid list params');
      this._listData$.next(null);
    }
  };

  private fetchCurrentListData() {
    console.log('attempting list data fetch');
    if (!this.listIDFromRoute && this.sourceTypeFromRoute !== 'provider') {
      console.log('Error fetching list details:', 'no list id found on route');
      return;
    }

    if (this.sourceTypeFromRoute === 'provider') {
      if (!['movies', 'series', 'all'].includes(this.listNameFromRoute || '')) {
        console.log('invalid media type list name for provider');
        return;
      }

      // netflix provider id is 8

      if (this.listNameFromRoute === 'movies') {
        this.movieService
          .getMoviesFromWatchProvider$(this.sourceIdFromRoute as number)
          .pipe(
            map((movies) =>
              this.transformMoviesToCardSectionProps('titlefefwef', movies, {
                sourceType: 'provider',
                sourceName: 'titlefefwef',
                sourceID: this.sourceIdFromRoute as number,
                listName: 'movies',
                listID: 0,
              }),
            ),
          )
          .subscribe({
            next: (listProps) => {
              this._listData$.next(listProps);
              // console.log(listProps);
              // this.fetchedMovieId = movie.id;
            },
            error: (error) => {
              console.error('Error fetching list details:', error);
              this._listData$.next(null);
            },
          });
      }

      if (this.listNameFromRoute === 'series') {
      }

      if (this.listNameFromRoute === 'all') {
      }
    }

    // this.tmdbService.movies.getMovieDetails(this.idFromRoute).subscribe({
    //   next: (movie) => {
    //     this._movieData$.next(movie);
    //     this.fetchedMovieId = movie.id;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching movie details:', error);
    //     this._movieData$.next(null);
    //   },
    // });
  }

  private transformMoviesToCardSectionProps(
    listName: string,
    moviesResponse: MovieSummaryResults,
    listInfo: ListInfo,
  ): ListViewProps {
    return {
      editable: true,
      id: listName + '-movies',
      listName: listName,
      titles: moviesResponse.results.map((movie) => ({
        ...movie,
        media_type: 'movie',
        onClick: () => {
          this.movieDetailsService.viewMovieDetails(
            movie.id,
            movie.title,
            listInfo,
          );
        },
      })),
    };
  }
}
