import { DestroyRef, Injectable, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TmdbService } from '../../../shared/services/tmdb/tmdb.service';
import { BehaviorSubject, filter, Observable, of, switchMap, tap } from 'rxjs';
import {
  Season,
  SeasonSummary,
  Series,
} from '../../../shared/interfaces/models/tmdb/Series';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type IdFromRoute = null | number;

@Injectable({
  providedIn: 'root',
})
export class SeriesDetailsService {
  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private destroyRef: DestroyRef,
  ) {
    this.listenForSeriesRouteVisit();
    this.listenForAllSeasonsSummary();
    this.listenForSelectedSeasonsSummary();
  }

  private fetchedSeriesId: number | null = null;
  private _seriesData$ = new BehaviorSubject<Series | null>(null);

  idFromRoute: IdFromRoute = null;
  isSeriesPickerShown$ = new BehaviorSubject<boolean | null>(null);
  selectedSeasonSummary$ = new BehaviorSubject<SeasonSummary | null>(null);
  seasonsSummary$ = new BehaviorSubject<SeasonSummary[]>([]);
  seriesData$: Observable<Series | null> = this._seriesData$.asObservable();

  selectedSeason: WritableSignal<string> = signal('');
  seasonsSummary: SeasonSummary[] = [];
  selectedSeasonSummary: SeasonSummary | null = null;

  listenForSeriesRouteVisit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isSeriesRoute) {
          this.updateCurrentSeries();
        }
      });
  }

  listenForAllSeasonsSummary() {
    this.seasonsSummary$
      .pipe(
        tap((seasons) => {
          takeUntilDestroyed(this.destroyRef),
            this.setSeason1OrSeasonAfterSpecials([...seasons]);
          this.seasonsSummary = seasons;
        }),
      )
      .subscribe();
  }

  listenForSelectedSeasonsSummary() {
    this.selectedSeasonSummary$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((selectedSeasonSum) => {
          if (!selectedSeasonSum) {
            return;
          }
          this.selectedSeasonSummary = selectedSeasonSum;
          this.selectedSeason.set(selectedSeasonSum.name);
        }),
      )
      .subscribe();
  }

  selectedSeasonData$: Observable<Season | null> =
    this.selectedSeasonSummary$.pipe(
      switchMap((season) => {
        if (!season) {
          return of(null);
        }

        if (season.season_number === undefined || !this.idFromRoute) {
          return of(null);
        }

        return this.tmdbService.series.getSeasonDetails(
          this.idFromRoute,
          season.season_number,
        );
      }),
    );

  viewSeriesDetails(id: number, title: string) {
    const titleSlugified = ('-' + title)
      .replace(/[^\p{L}\p{N}-]/giu, '-')
      .replace(/-{2}/, '-')
      .toLowerCase();
    this._seriesData$.next(null);
    this.router.navigateByUrl(`/series/${id}${titleSlugified}`);
  }

  get isSeriesRoute(): boolean {
    return /\/series\//.test(this.router.url);
  }

  private updateCurrentSeries() {
    const urlSegments = this.router.url.split('/');
    const titleId = parseInt(urlSegments[2].match(/^\d*/)![0], 10);
    this.idFromRoute = titleId;

    if (!isNaN(titleId) && titleId == this.fetchedSeriesId) {
      return;
    }

    if (!isNaN(titleId) && this.isSeriesRoute) {
      this.fetchCurrentSeriesData();
    } else {
      this._seriesData$.next(null);
    }
  }

  private fetchCurrentSeriesData() {
    if (!this.idFromRoute) {
      console.log(
        'Error fetching series details:',
        'no series id found on route',
      );
      return;
    }

    this.tmdbService.series.getSeriesDetails(this.idFromRoute).subscribe({
      next: (series) => {
        this.seasonsSummary$.next(
          series.seasons.filter((season) => season.episode_count > 0),
        );
        this._seriesData$.next(series);
        this.fetchedSeriesId = series.id;
      },
      error: (error) => {
        console.error('Error fetching series details:', error);
        this._seriesData$.next(null);
      },
    });
  }

  setSeason1OrSeasonAfterSpecials(seasons: SeasonSummary[]) {
    const seasonOne = seasons.find((season) => season.name === 'Season 1');
    const seasonOtherThanSeason1OrSpecials = seasons.filter(
      (season) => season.name !== 'Specials',
    )[0];

    if (seasonOne) {
      this.selectedSeasonSummary$.next(seasonOne);
    } else if (seasonOtherThanSeason1OrSpecials) {
      this.selectedSeasonSummary$.next(seasonOtherThanSeason1OrSpecials);
    } else if (seasons[0]) {
      this.selectedSeasonSummary$.next(seasons[0]);
    } else {
      this.selectedSeasonSummary$.next(null);
    }
  }
}
