import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MediaCardProps } from '../../../../shared/components/card-section/media-card/media-card.component';
import {
  SectionTitleProps,
  SectionTitleComponent,
} from '../../../../shared/components/section-title/section-title.component';
import { ListInfo } from '../../feature/lists-home.component';
import { ListViewService } from '../../data-access/list-view.service';
import { CommonModule } from '@angular/common';
import { ListsService } from '../../data-access/lists.service';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MediaSummary } from '../../../../shared/interfaces/models/tmdb/All';
import { MovieService } from '../../../../shared/services/tmdb/movie.service';
import { SeriesService } from '../../../../shared/services/tmdb/series.service'; // Import SeriesService

export interface ListPreviewProps extends SectionTitleProps {
  titles?: MediaCardProps[]; // Make optional since it's no longer being fetched here
  id: string;
  iconURL: string;
  listInfo: ListInfo;
  results?: MediaSummary[];
}

@Component({
  selector: 'app-list-preview',
  imports: [SectionTitleComponent, CommonModule],
  templateUrl: './list-preview.component.html',
  styleUrl: './list-preview.component.scss',
})
export class ListPreviewComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private listViewService: ListViewService,
    private listsService: ListsService,
    private movieService: MovieService,
    private seriesService: SeriesService, // Inject SeriesService
  ) {}

  private _listInfo = new BehaviorSubject<ListInfo | undefined>(undefined);
  @Input() set listInfo(value: ListInfo | undefined) {
    this._listInfo.next(value);
  }
  get listInfo(): ListInfo | undefined {
    return this._listInfo.value;
  }

  props: ListPreviewProps = {
    id: '',
    iconURL: 'assets/icons/lists/list-icon/eye.svg',
    sectionTitle: 'List Name',
    listInfo: {
      sourceType: 'user',
      sourceName: null,
      sourceID: 0,
      listName: '',
      listID: 0,
    },
    viewAllButtonProps: { onClick: () => {} },
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: '',
    viewAllButtonProps: { onClick: () => {} },
    iconURL: '',
  };

  private destroy$ = new Subject<void>();
  public results$ = new BehaviorSubject<MediaSummary[]>([]);

  ngOnInit() {
    this._listInfo
      .pipe(
        tap((listInfo) => {
          if (!listInfo) {
            return;
          }
          this.props = {
            ...this.props,
            listInfo: listInfo,
            sectionTitle: listInfo?.listName || '',
          };
          this.sectionTitleOptions = {
            sectionTitle: this.props.sectionTitle,
            viewAllButtonProps: {
              onClick: () => this.viewList(),
            },
            iconURL: this.props.iconURL,
          };
        }),
        switchMap((listInfo) => {
          if (!listInfo) {
            return of(null);
          }
          // Fetch the list data using the ListsService or MovieService based on listInfo
          return this.fetchListData(listInfo);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.results$.next(data.results);
        }
      });
  }

  ngOnChanges(): void {
    // this.updateProps(); // Keep updateProps, it will update on every change
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchListData(listInfo: ListInfo): Observable<any> {
    // Example: Fetch movies from a watch provider
    if (listInfo.sourceType === 'provider') {
      if (listInfo.listName === 'movies') {
        return this.movieService.getMoviesFromWatchProvider$(
          listInfo.sourceID ?? 0, // Use MovieService
          1,
        );
      } else if (listInfo.listName === 'series') {
        return this.seriesService.getSeriesFromWatchProvider$(
          // Use SeriesService
          listInfo.sourceID ?? 0,
          1,
        );
      }
    } else if (listInfo.sourceType === 'home') {
      if (listInfo.listName === 'movies') {
        if (listInfo.listID === 1) {
          return this.movieService.getMoviesPlayingInTheares$();
        } else if (listInfo.listID === 2) {
          return this.movieService.getUpcomingMovies$();
        }
      }
    }
    return of(null);
  }

  viewList() {
    if (this.listInfo) {
      this.listViewService.viewList(this.listInfo);
    }
  }
}
