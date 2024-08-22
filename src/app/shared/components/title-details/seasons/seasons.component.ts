import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { EpisodeGroupComponent } from './episode-group/episode-group.component';
import { Season, SeasonSummary, Series } from '../../../interfaces/tmdb/Series';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { TitleDetailsService } from '../../../services/component-configs/title-details/title-details.service';
import {
  PopupItemType,
  PopupOrBottomSheetComponent,
  PopupOrBottomSheetConfig,
} from '../../popup-or-bottom-sheet/popup-or-bottom-sheet.component';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  map,
  Observable,
  pluck,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { ElementPositionService } from '../../../services/element-position.service';
import { WindowResizeService } from '../../../services/window-resize.service';
import { EpisodeCardComponent } from './episode-card/episode-card.component';
import { ScrollDisablerService } from '../../../services/scroll-disabler.service';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [
    EpisodeGroupComponent,
    PopupOrBottomSheetComponent,
    RouterOutlet,
    CommonModule,
    EpisodeCardComponent,
  ],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
})
export class SeasonsComponent {
  constructor(
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private router: Router,
    private titleDetailsConfigService: TitleDetailsService,
    private elemPositionService: ElementPositionService,
    private windowResizeService: WindowResizeService,
    private scrollDisabler: ScrollDisablerService
  ) {}

  seasonSummaries: SeasonSummary[] = [];
  seasonId!: number;

  seasonsConfig = this.titleDetailsConfigService.config.seasons;

  seasonPickerConfig: PopupOrBottomSheetConfig = {
    anchorElementId: 'season-picker-tab',
    itemsType: 'texts',
    items: [],
  };

  getSeasonId() {
    return this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.seasonId = parseInt(id);
      }
    });
  }

  ngOnInit() {
    this.getSeasonId();
    this.fetchSeasonsSummaries();
    this.initializeResizeSubscriptions();
  }

  ngOnDestroy() {
    this.getSeasonId()?.unsubscribe;
    this.fetchSeasonsSummaries()?.unsubscribe;
    this.titleDetailsConfigService.config.seasons.pickerShown = false;
    this.untrackAndUnsubscribe();
  }

  fetchSeasonsSummaries = () => {
    if (!this.isSeries) {
      return null;
    }
    return this.tmdbService.series
      .getSeriesDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Series) => {
          const seasons = data.seasons;
          this.seasonId = data.id;
          this.seasonSummaries = seasons;

          seasons.forEach((season) => {
            const mappedSeason: PopupItemType = {
              textContent: '',
              callback: function (): void {},
              isSelected: function (): boolean {
                return false;
              },
            };

            mappedSeason.textContent = season.name;
            mappedSeason.callback = () => {
              this.seasonsConfig.selectedSeason = season.name;
            };
            mappedSeason.isSelected = () => {
              return this.seasonsConfig.selectedSeason === season.name;
            };

            this.seasonPickerConfig.items.push(mappedSeason);
          });
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };

  get isSeries(): boolean {
    return /series/.test(this.router.url);
  }

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  @ViewChild('dialog') dialogElementRef!: ElementRef;
  dialogElement!: HTMLDialogElement;
  dialogPopupElement!: HTMLDivElement;

  anchorElementPosition$: Observable<DOMRect> | undefined;
  popupElementPosition$: Observable<DOMRect> | undefined;

  showDialog() {
    this.dialogElement.classList.remove('hide');
    this.dialogElement.classList.add('shown');
    // this.scrollDisabler.disableScroll();
  }

  hideDialog() {
    this.dialogElement.classList.add('hide');
    this.dialogElement.classList.remove('shown');
    this.seasonsConfig.pickerShown = false;
    this.windowResizeService.triggerResize();
    this.scrollDisabler.enableScroll();
  }

  ngAfterViewInit() {
    this.startSeasonPickerDialogPositioner();
    this.trackAnchorElement();
  }

  startSeasonPickerDialogPositioner() {
    this.dialogElement = this.dialogElementRef.nativeElement;
    this.dialogPopupElement = this.dialogElement.querySelector(
      '.dialog__arrow-and-items-container'
    ) as HTMLDivElement;

    this.trackAnchorElement();
  }

  trackAnchorElement() {
    setTimeout(() => {
      const anchorElementRef = this.elemPositionService.getElementRefById(
        this.seasonPickerConfig.anchorElementId
      );

      if (anchorElementRef) {
        this.anchorElementPosition$ =
          this.elemPositionService.trackElementPosition(
            this.seasonPickerConfig.anchorElementId,
            anchorElementRef
          );

        this.anchorElementPosition$.subscribe((position) => {
          const popup = this.dialogPopupElement.getBoundingClientRect();

          if (this.windowDimensions.width < 768) {
            this.dialogPopupElement.style.top = 'unset';
            this.dialogPopupElement.style.bottom = '0';
            this.dialogPopupElement.style.left = 'unset';
            return;
          }
          const diff = (popup.width - position.width) / 2;

          this.dialogPopupElement.style.top =
            (position.top + (position.height + 32)).toString() + 'px';
          this.dialogPopupElement.style.bottom = 'unset';
          this.dialogPopupElement.style.left =
            (position.left - diff).toString() + 'px';
        });
      }
    }, 50);
  }

  initializeResizeSubscriptions() {
    this._resizeSubscription =
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this._isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });
    this.windowResizeService.isResizing();
  }

  untrackAndUnsubscribe() {
    this.elemPositionService.untrackElementPosition(
      this.seasonPickerConfig.anchorElementId
    );
    this._resizeSubscription?.unsubscribe();
    this._isResizingSubscription?.unsubscribe();
  }

  isResizing = false;
  windowDimensions: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;
}

export interface SeasonsConfig {
  seasons: Season[];
  selectedSeason: string;
  pickerShown: boolean;
}
