import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  tap,
  switchMap,
  of,
  take,
} from 'rxjs';
import { ListInfo, ListSourceType } from '../feature/lists-home.component';
import { MovieService } from '../../../shared/services/tmdb/movie.service';
import { MovieDetailsService } from '../../details/movie-details/data-access/movie-details.service';
import { ListViewProps } from '../ui/list-view/list-view.component';
import { SeriesService } from '../../../shared/services/tmdb/series.service';
import { MediaSummary } from '../../../shared/interfaces/models/tmdb/All';
import { SeriesDetailsService } from '../../details/series-details/data-access/series-details.service';
import { FormatService } from '../../../shared/services/utility/format.service';

@Injectable({
  providedIn: 'root',
})
export class ListViewService {
  constructor(
    private router: Router,
    private movieService: MovieService,
    private movieDetailsService: MovieDetailsService,
    private seriesService: SeriesService,
    private seriesDetailsService: SeriesDetailsService,
    private formatService: FormatService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isListsRoute) {
          // console.log('list route detected');
          this.updateCurrentList();
        }
      });
  }

  private currentListInfoSubject = new BehaviorSubject<ListInfo | null>(null);
  currentListInfo$ = this.currentListInfoSubject.asObservable();

  private _listData$ = new BehaviorSubject<ListViewProps | null>(null);
  listData$: Observable<ListViewProps | null> = this._listData$.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  totalPages$ = this.totalPagesSubject.asObservable();

  private totalResultsSubject = new BehaviorSubject<number>(0);
  totalResults$ = this.totalResultsSubject.asObservable();

  private listResultsSubject = new BehaviorSubject<MediaSummary[]>([]);
  listResults$ = this.listResultsSubject.asObservable();

  private isEditableSubject = new BehaviorSubject<boolean>(false);
  isEditable$ = this.isEditableSubject.asObservable();

  private currentListNameSubject = new BehaviorSubject<string>('');
  currentListName$ = this.currentListNameSubject.asObservable();

  private currentListIdSubject = new BehaviorSubject<number>(0);
  currentListId$ = this.currentListIdSubject.asObservable();

  private currentSourceTypeSubject = new BehaviorSubject<string>('');
  currentSourceType$ = this.currentSourceTypeSubject.asObservable();

  private currentSourceIdSubject = new BehaviorSubject<number>(0);
  currentSourceId$ = this.currentSourceIdSubject.asObservable();

  private currentSourceNameSubject = new BehaviorSubject<string>('');
  currentSourceName$ = this.currentSourceNameSubject.asObservable();

  get isListsRoute(): boolean {
    return /\/lists\//.test(this.router.url);
  }

  viewList(listInfo: ListInfo) {
    this.currentListInfoSubject.next(listInfo);
    this.currentPageSubject.next(1); // Reset to the first page when viewing a new list
    this.listResultsSubject.next([]); // Clear existing results

    const { sourceType, sourceName, sourceID, listID, listName } = listInfo;

    const sourceIdAndName = `${sourceID}-${sourceName?.toLocaleLowerCase()}`;
    const listIDAndName = `${listID}-${listName.toLocaleLowerCase()}`;

    this.router.navigateByUrl(
      `/lists/${sourceType}/${sourceIdAndName}/${listIDAndName}`,
    );
  }

  private updateCurrentList = () => {
    const urlSegments = this.router.url.split('/');

    const validSourceTypes = ['user', 'provider', 'community', 'home'];

    const sourceType = urlSegments[2] as ListSourceType;
    const sourceID = parseInt(urlSegments[3].match(/^\d+/)?.[0] || '', 10);

    let sourceName = urlSegments[3].split('-')[1] || urlSegments[3];
    sourceName = decodeURIComponent(sourceName); // Decode the sourceName
    sourceName = sourceName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '); // Capitalize the first letter of every word

    const listId = parseInt(urlSegments[4].match(/^\d+/)?.[0] || '', 10);
    const listName = urlSegments[4].split('-')[1] || urlSegments[4]; // this only sets the first word of the list's name
    // console.log(`type: ${sourceType}`, `sID:${sourceID}`, `listID:${listId}`);

    if (
      (!isNaN(listId) || sourceType === 'provider') &&
      this.isListsRoute &&
      validSourceTypes.includes(sourceType) &&
      (sourceType === 'home' || !isNaN(sourceID))
    ) {
      this.currentSourceNameSubject.next(
        this.formatService.truncate(sourceName, 6, '...', 6),
      );
      this.currentSourceTypeSubject.next(sourceType);
      this.currentSourceIdSubject.next(sourceID);
      this.currentListIdSubject.next(listId);
      this.currentListNameSubject.next(listName);

      const listInfoFromRoute: ListInfo = {
        sourceType: sourceType as ListSourceType,
        sourceName: listName,
        sourceID: sourceID,
        listName: listName,
        listID: listId,
      };

      this.currentListInfoSubject.next(listInfoFromRoute);

      this.fetchCurrentListData(this.currentPageSubject.value);
    } else {
      // console.log('invalid list params');
      this._listData$.next(null);
    }
  };

  private fetchCurrentListData(page: number) {
    // console.log('attempting list data fetch');
    const listInfo = this.currentListInfoSubject.value;

    if (!listInfo) {
      // console.log('Error fetching list details: no list info found');
      return;
    }

    this.fetchListData(listInfo, page)
      .pipe(
        tap((data) => {
          if (data) {
            this.totalPagesSubject.next(data.total_pages);
            this.totalResultsSubject.next(data.total_results);
            this.appendListResults(data.results);
            this.isEditableSubject.next(true);
          }
        }),
        switchMap(() => {
          return this.listResults$.pipe(take(1));
        }),
        map((results) => {
          if (!listInfo) return null;

          if (listInfo.listName === 'movies') {
            return this.transformMoviesToCardSectionProps(
              listInfo.listName,
              results,
              listInfo,
            );
          } else if (listInfo.listName === 'series') {
            return this.transformSeriesToCardSectionProps(
              listInfo.listName,
              results,
              listInfo,
            );
          } else {
            // console.log('Unsupported list type');
            return null;
          }
        }),
      )
      .subscribe({
        next: (listProps) => {
          this._listData$.next(listProps);
        },
        error: (error) => {
          console.error('Error fetching list details:', error);
          this._listData$.next(null);
        },
      });
  }

  private fetchListData(listInfo: ListInfo, page: number): Observable<any> {
    switch (listInfo.sourceType) {
      case 'provider':
        return this.fetchDataFromProvider(
          listInfo.sourceID ?? 0,
          listInfo.listName,
          page,
        );
      case 'home':
        return this.fetchDataFromHome(listInfo.listID, listInfo.listName, page);
      case 'user':
        return this.fetchDataFromUser(
          listInfo.sourceID ?? 0,
          listInfo.listID,
          page,
        );
      case 'community':
        return this.fetchDataFromCommunity(listInfo.listID, page);
      default:
        // console.log('Unsupported source type');
        return of(null);
    }
  }

  private fetchDataFromProvider(
    sourceID: number,
    listName: string,
    page: number,
  ): Observable<any> {
    if (listName === 'movies') {
      return this.movieService.getMoviesFromWatchProvider$(sourceID, page);
    } else if (listName === 'series') {
      return this.seriesService.getSeriesFromWatchProvider$(sourceID, page);
    } else if (listName === 'all') {
      return this.movieService.getMoviesFromWatchProvider$(sourceID, page).pipe(
        switchMap((movies) =>
          this.seriesService.getSeriesFromWatchProvider$(sourceID, page).pipe(
            map((series) => ({
              ...movies,
              results: [...movies.results, ...series.results],
            })),
          ),
        ),
      );
    } else {
      // console.log('invalid media type list name for provider');
      return of(null);
    }
  }

  private fetchDataFromHome(
    listID: number,
    listName: string,
    page: number,
  ): Observable<any> {
    if (listName === 'movies') {
      if (listID === 1) {
        return this.movieService.getMoviesPlayingInTheares$(page);
      } else if (listID === 2) {
        return this.movieService.getUpcomingMovies$(page);
      } else {
        // console.log('invalid list id for home');
        return of(null);
      }
    } else if (listName === 'series') {
      // Add logic to fetch series data for home lists
      if (listID === 1) {
        // Assuming you have a method to get popular series
        return this.seriesService.getPopularSeries$();
      } else {
        // console.log('invalid list id for home series');
        return of(null);
      }
    } else {
      // console.log('invalid media type list name for home');
      return of(null);
    }
  }

  private fetchDataFromUser(
    sourceID: number,
    listID: number,
    page: number,
  ): Observable<any> {
    // console.log('Fetching data from user - Not implemented yet');
    return of(null);
  }

  private fetchDataFromCommunity(
    listID: number,
    page: number,
  ): Observable<any> {
    // console.log('Fetching data from community - Not implemented yet');
    return of(null);
  }

  private transformMoviesToCardSectionProps(
    listName: string,
    movies: MediaSummary[], // Accept MediaSummary[]
    listInfo: ListInfo,
  ): ListViewProps {
    return {
      editable: true,
      id: listName + '-movies',
      listName: listName,
      titles: movies.map((movie) => ({
        ...movie,
        media_type: 'movie',
        onClick: () => {
          this.movieDetailsService.viewMovieDetails(
            movie.id,
            movie.title as string,
            listInfo,
          );
        },
      })),
    };
  }

  private transformSeriesToCardSectionProps(
    listName: string,
    series: MediaSummary[], // Accept MediaSummary[]
    listInfo: ListInfo,
  ): ListViewProps {
    return {
      editable: true,
      id: listName + '-series',
      listName: listName,
      titles: series.map((seriesItem) => ({
        ...seriesItem,
        media_type: 'tv',
        onClick: () => {
          this.seriesDetailsService.viewSeriesDetails(
            seriesItem.id,
            seriesItem.name as string,
            listInfo,
          );
        },
      })),
    };
  }

  // Method to change the current page
  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
    this.fetchCurrentListData(page);
  }

  getCurrentPage(): Observable<number> {
    return this.currentPage$;
  }

  // Helper method to append new results to the list
  private appendListResults(newResults: MediaSummary[]): void {
    const currentResults = this.listResultsSubject.value;
    const updatedResults = [
      ...currentResults,
      ...newResults.filter(
        (newResult) =>
          !currentResults.find(
            (currentResult) => currentResult.id === newResult.id,
          ),
      ),
    ];
    this.listResultsSubject.next(updatedResults);
  }
}
