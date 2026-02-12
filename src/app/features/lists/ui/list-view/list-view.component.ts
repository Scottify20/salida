import {
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  HeaderButtonProps,
  HeaderButtonComponent,
} from '../../../../shared/components/header-button/header-button.component';
import {
  MediaCardProps,
  MediaCardComponent,
} from '../../../../shared/components/card-section/media-card/media-card.component';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListViewService } from '../../data-access/list-view.service';
import { AsyncPipe } from '@angular/common';
import { tap, take, switchMap } from 'rxjs';
import { IntersectionObserverService } from '../../../../shared/services/dom/intersection-observer.service';
import { PlatformCheckService } from '../../../../shared/services/dom/platform-check.service';

export interface ListViewProps {
  listName: string;
  id: string;
  titles: MediaCardProps[];
  editable: boolean; // change this to check if owner instead
}

@Component({
  selector: 'app-list-view',
  imports: [HeaderButtonComponent, MediaCardComponent, AsyncPipe],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
})
export class ListViewComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    protected listsService: ListViewService,
    private destroyRef: DestroyRef,
    private intersectionObserverService: IntersectionObserverService,
    private platformCheckService: PlatformCheckService,
  ) {}

  @ViewChild('cardsContainer') cardsContainer!: ElementRef;
  @ViewChild('intersectionTarget') intersectionTarget!: ElementRef;

  private loading = false;

  // ngOnInit() {
  //   combineLatest([this.listsService.listData$, this.listsService.isEditable$])
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe(([data, isEditable]) => {
  //       if (data) {
  //         this.props.listName = data.listName;
  //         this.props.editable = isEditable;
  //       }
  //     });

  //   this.listsService.listResults$
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       tap((results) => {
  //         // console.log('New titles appended:', results); // Console log the updated titles
  //       }),
  //     )
  //     .subscribe((results) => {
  //       this.props.titles = results.map((result) => ({
  //         ...result,
  //         media_type: result.media_type || 'movie', // Provide a default value
  //       }));
  //     });

  //   this.listsService.currentListName$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((listName) => {
  //       this.props.listName = listName;
  //     });
  // }

  ngOnInit() {
  combineLatest([
    this.listsService.listData$, 
    this.listsService.isEditable$,
    this.listsService.currentListName$
  ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(([data, isEditable, listName]) => {
      if (data) {
        this.props = {
          ...this.props,
          listName: listName || data.listName,
          id: data.id,
          titles: data.titles,
          editable: isEditable,
        };
      }
    });
}

  ngAfterViewInit(): void {
    if (this.platformCheckService.isBrowser()) {
      this.observeElement();
    }
  }

  ngOnDestroy(): void {
    if (
      this.platformCheckService.isBrowser() &&
      this.intersectionTarget &&
      this.intersectionObserverService
    ) {
      this.intersectionObserverService.unobserve(
        this.intersectionTarget.nativeElement,
      );
      this.intersectionObserverService.disconnect();
    }
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

  observeElement() {
    if (!this.intersectionTarget) {
      return;
    }

    this.intersectionObserverService.observe(
      this.intersectionTarget.nativeElement,
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadMoreData();
          }
        });
      },
      {
        rootMargin: '500px',
        threshold: 1,
      },
    );
  }

  loadMoreData(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.listsService.currentPage$
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        switchMap((currentPage) => {
          return this.listsService.totalPages$.pipe(
            take(1),
            tap((totalPages) => {
              if (currentPage < totalPages) {
                this.listsService.setCurrentPage(currentPage + 1);
              }
              this.loading = false;
            }),
          );
        }),
      )
      .subscribe();
  }
}
