import { Component, signal, ElementRef } from '@angular/core';
import {
  HeaderButtonProps,
  HeaderButtonComponent,
} from '../../../shared/components/header-button/header-button.component';
import { UserService } from '../../../core/user/user.service';
import {
  DropdownPickerTabComponent,
  DropDownPickerTabProps,
} from '../../../shared/components/tabs/dropdown-picker-tab/dropdown-picker-tab.component';
import {
  PopoverMenuProps,
  PopoverMenuComponent,
} from '../../../shared/components/popover-menu/popover-menu.component';
import { HomeService } from '../data-access/home.service';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { HomeMovieService } from '../data-access/home-movie.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HomeSeriesService } from '../data-access/home-series.service';
import { MediaSummary } from '../../../shared/interfaces/models/tmdb/All';
import { SeriesSummary } from '../../../shared/interfaces/models/tmdb/Series';
import { MovieSummary } from '../../../shared/interfaces/models/tmdb/Movies';
import {
  MediaCardsSectionProps,
  MediaCardsSectionComponent,
} from '../../../shared/components/card-section/media-cards-section/media-cards-section.component';
import { HeroCardProps } from '../ui/hero-card/hero-card.component';
import { HeroCardsComponent } from '../ui/hero-cards/hero-cards.component';
import { UserActionsMenuPopoverComponent } from '../ui/user-actions-menu-popover/user-actions-menu-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: '../ui/home.component.html',
  styleUrls: ['../ui/home.component.scss'],
  imports: [
    HeaderButtonComponent,
    UserActionsMenuPopoverComponent,
    DropdownPickerTabComponent,
    PopoverMenuComponent,
    PillIndexedTabsComponent,
    AsyncPipe,
    CommonModule,
    MediaCardsSectionComponent,
    HeroCardsComponent,
  ],
})
export class HomeComponent {
  constructor(
    private userService: UserService,
    protected homeService: HomeService,
    private elementRef: ElementRef,
    private homeMovieService: HomeMovieService,
    private homeSeriesService: HomeSeriesService,
  ) {}
  // TODO the scrollLeft of each heroCards carousel must be seperate for each content type

  heroCardsTitlesPropsForMoviesAndSeries$: Observable<MediaSummary[]> =
    this.homeService.getPopularMoviesAndSeries$();

  heroCardsTitlesPropsForMovies$: Observable<MovieSummary[]> =
    this.homeMovieService
      .getPopularMovies$()
      .pipe(map((movies) => movies.slice(0, 5)));

  isHeroCardProps(media: MediaSummary[]): media is HeroCardProps[] {
    return media[0].media_type === 'movie' || media[0].media_type === 'tv';
  }

  heroCardsTitlesPropsForSeries$: Observable<SeriesSummary[]> =
    this.homeSeriesService
      .getPopularSeries$()
      .pipe(map((series) => series.slice(0, 5)));

  moviesInTheatresProps$: Observable<MediaCardsSectionProps> =
    this.homeMovieService.getMoviesInTheatres();

  upcomingMoviesProps$: Observable<MediaCardsSectionProps> =
    this.homeMovieService.getUpcomingMovies();

  moviesFromProvidersProps$: Observable<MediaCardsSectionProps[]> =
    this.homeMovieService.getMoviesFromProviders();

  seriesFromProvidersProps$: Observable<MediaCardsSectionProps[]> =
    this.homeSeriesService.getSeriesFromProviders();

  // Observable for combined movies and series from providers
  moviesAndSeriesFromProvidersProps$: Observable<MediaCardsSectionProps[]> =
    this.homeService.getMoviesAndSeriesFromProviders$();

  headerButtonsProps: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: 'assets/icons/home-header/Logo-placeholder-solid.svg',
    },
    {
      id: 'user-button',
      type: 'icon',
      iconPath: this.userService.userPhotoUrlSig,
    },
  ];

  contentTypeDropdownTabProps: DropDownPickerTabProps = {
    id: 'home-content-type-dropdown-picker-tab',
    text: this.homeService.selectedContentTypeName,
    callback: () => {},
    visibleIf: () => true,
    animateArrow: true,
    arrowDirection: signal('down'),
  };

  contentTypePopoverMenuProps: PopoverMenuProps = {
    popoverId: 'content-type-menu-props',
    anchoringConfig: {
      anchorElementId: 'home-content-type-dropdown-picker-tab',
      position: 'bottom',
      onOutsideClickCallback: () => {
        this.contentTypeDropdownTabProps.arrowDirection.set('down');
      },
    },
    backdrop: 'mobile-only',
    itemGroupsConfig: {
      highlightSelectedItem: true,
      groups: [
        {
          contentType: 'text',
          sectionName: '',
          items: this.homeService.contentTypes.map((tabName, index) => ({
            text: tabName,
            isActive: () =>
              tabName == this.homeService.selectedContentTypeName(),
            onClickCallback: () => {
              this.homeService.setContentTypeByIndex(index);
              this.animateContentOnPopoverItemClick();
              this.contentTypeDropdownTabProps.arrowDirection.set('down');
            },
          })),
        },
      ],
    },
  };

  pillTabProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    animationType: 'fade',
    tabs: this.homeService.contentTypes.map((tabName) => ({
      text: tabName,
      onClickCallback: () => {
        this.homeService.setContentTypeByName(tabName);
      },
    })),
    defaultTabIndex: this.homeService.selectedContentTypeIndex,
  };

  animateContentOnPopoverItemClick() {
    const homeComponentElement = this.elementRef.nativeElement as HTMLElement;
    const componentViewsContainer = homeComponentElement.querySelector(
      '[component-transition]',
    ) as null | HTMLElement;

    if (componentViewsContainer) {
      homeComponentElement.style.overflow = 'hidden';
      componentViewsContainer.classList.add('fade-in');

      componentViewsContainer.addEventListener('animationend', () => {
        componentViewsContainer.classList.remove('fade-in');
        homeComponentElement.style.overflow = 'visible';
      });
    }
  }
}
