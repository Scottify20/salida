import { Component, inject } from '@angular/core';
import { MediaCardProps } from '../../../../shared/components/card-section/media-card/media-card.component';
import {
  SectionTitleProps,
  SectionTitleComponent,
} from '../../../../shared/components/section-title/section-title.component';
import { MovieSummaryResults } from '../../../../shared/interfaces/models/tmdb/Movies';
import { map, Observable } from 'rxjs';
import { MovieService } from '../../../../shared/services/tmdb/movie.service';
import { ListInfo } from '../../feature/lists-home.component';
import { ListViewService } from '../../data-access/list-view.service';

export interface ListPreviewProps extends SectionTitleProps {
  titles: MediaCardProps[];
  id: string;
  iconURL: string;
  listInfo: ListInfo;
}

@Component({
  selector: 'app-list-preview',
  imports: [SectionTitleComponent],
  templateUrl: './list-preview.component.html',
  styleUrl: './list-preview.component.scss',
})
export class ListPreviewComponent {
  private movieService = inject(MovieService);
  private listViewService = inject(ListViewService);


  // @Input({required: true}) props!:  ListPreviewProps;
  props: ListPreviewProps = {
    titles: [],
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

  viewList() {
    this.listViewService.viewList(this.props.listInfo);
  }

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.props.sectionTitle,
    viewAllButtonProps: this.props.viewAllButtonProps,
    iconURL: this.props.iconURL,
  };

  ngOnInit() {
    this.getMoviesInTheatres().subscribe((props) => {
      this.props = props;
    });
  }

  ngOnChanges(): void {
    this.sectionTitleOptions = {
      sectionTitle: this.props.sectionTitle,
      viewAllButtonProps: this.props.viewAllButtonProps,
    };
  }

  getMoviesInTheatres(): Observable<ListPreviewProps> {
    return this.movieService
      .getMoviesPlayingInTheares$()
      .pipe(
        map((movies) =>
          this.transformMoviesToCardSectionProps('In Theatres', movies),
        ),
      );
  }

  private transformMoviesToCardSectionProps(
    title: string,
    moviesResponse: MovieSummaryResults,
  ): ListPreviewProps {
    return {
      id: title + '-movies',
      sectionTitle: title,
      iconURL: '',
      viewAllButtonProps: { onClick: () => {} },
      titles: moviesResponse.results.map((movie) => ({
        ...movie,
        media_type: 'movie',
      })),
      listInfo: {
        sourceType: 'provider',
        sourceName: 'Netflix',
        sourceID: 8,
        listName: 'Movies',
        listID: 0,
      },
    };
  }
}
