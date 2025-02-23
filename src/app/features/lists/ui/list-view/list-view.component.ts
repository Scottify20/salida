import { Component, DestroyRef, inject } from '@angular/core';
import {
  HeaderButtonProps,
  HeaderButtonComponent,
} from '../../../../shared/components/header-button/header-button.component';
import {
  MediaCardProps,
  MediaCardComponent,
} from '../../../../shared/components/card-section/media-card/media-card.component';
import { MovieSummaryResults } from '../../../../shared/interfaces/models/tmdb/Movies';
import { MediaCardsSectionProps } from '../../../../shared/components/card-section/media-cards-section/media-cards-section.component';
import { filter, map, Observable } from 'rxjs';
import { MovieService } from '../../../../shared/services/tmdb/movie.service';
import { MovieDetailsService } from '../../../details/movie-details/data-access/movie-details.service';
import { Router } from '@angular/router';
import { ListsService } from '../../data-access/lists.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListViewService } from '../../data-access/list-view.service';

export interface ListViewProps {
  listName: string;
  id: string;
  titles: MediaCardProps[];
  editable: boolean; // change this to check if owner instead
}

@Component({
  selector: 'app-list-view',
  imports: [HeaderButtonComponent, MediaCardComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
})
export class ListViewComponent {
  private router = inject(Router);
  protected listsService = inject(ListViewService);
  private destroyRef = inject(DestroyRef);


  ngOnInit() {
    this.listsService.listData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          this.props.titles = data.titles;
          this.props.editable = true;
        }
      });
  }

  props: ListViewProps = {
    listName: 'List Name',
    id: '',
    titles: [],
    editable: false,
  };

  goHome() {
    this.router.navigateByUrl('/lists');
  }

  goBack() {
    history.back();
  }

  editList() {}

  headerButtonsProps: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: '/assets/icons/lists/edit.svg',
      ariaLabel: 'Edit list',
    },
    {
      type: 'icon',
      iconPath: '/assets/icons/header/Back.svg',
      ariaLabel: 'Go back to previous page',
    },
  ];
}
