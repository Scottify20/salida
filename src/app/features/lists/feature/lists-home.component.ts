import { Component, signal } from '@angular/core';
import {
  HeaderButtonProps,
  HeaderButtonComponent,
} from '../../../shared/components/header-button/header-button.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { Observable } from 'rxjs';
import { MovieService } from '../../../shared/services/tmdb/movie.service';
import { SeriesService } from '../../../shared/services/tmdb/series.service';
import { map, of } from 'rxjs';
import { MediaSummary } from '../../../shared/interfaces/models/tmdb/All';

export interface ListInfo {
  sourceType: ListSourceType;
  sourceName: string | null;
  sourceID: number | null; // sourceID can be null
  listName: string;
  listID: number;
}

export type ListSourceType = 'user' | 'provider' | 'community' | 'home';

@Component({
  selector: 'app-lists-home',
  imports: [HeaderButtonComponent, PillIndexedTabsComponent],
  templateUrl: '../ui/lists-home.component.html',
  styleUrl: '../ui/lists-home.component.scss',
  standalone: true,
})
export class ListsHomeComponent {
  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService,
  ) {}

  listSource = signal<'personal' | 'community'>('personal');

  pillTabProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [
      {
        text: 'Personal',
        onClickCallback: () => {
          this.listSource.set('personal');
        },
      },
      {
        text: 'Community',
        onClickCallback: () => {
          this.listSource.set('community');
        },
      },
    ],
    animationType: 'slide',
    swipeGestures: true,
  };

  headerButtonsProps: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: '/assets/icons/lists/add.svg',
      ariaLabel: 'Add a list',
    },
  ];

  getResults$(listInfo: ListInfo): Observable<MediaSummary[]> {
    if (listInfo.sourceType === 'provider') {
      if (listInfo.listName === 'movies') {
        return this.movieService
          .getMoviesFromWatchProvider$(listInfo.sourceID ?? 0, 1)
          .pipe(map((data) => data.results));
      } else if (listInfo.listName === 'series') {
        return this.seriesService
          .getSeriesFromWatchProvider$(listInfo.sourceID ?? 0, 1)
          .pipe(map((data) => data.results));
      }
    }
    return of([]);
  }
}
