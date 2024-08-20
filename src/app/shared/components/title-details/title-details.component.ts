import { PillTabsConfig } from '../pill-tabs/pill-tabs.component';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TextsSectionComponent } from '../texts-section/texts-section.component';
import {
  HeaderButton,
  ButtonsHeaderComponent,
} from '../buttons-header/buttons-header.component';
import { PillTabsComponent } from '../pill-tabs/pill-tabs.component';
import { RatingsSectionComponent } from './more-details/ratings-section/ratings-section.component';
import { CardsSectionComponent } from '../cards-section/cards-section.component';

import { PlotSectionComponent } from './more-details/plot-section/plot-section.component';
import { TitleHeroComponent } from './title-hero/title-hero.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { TitleDetailsService } from '../../services/component-configs/title-details/title-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-title-details',
  standalone: true,
  imports: [
    RouterOutlet,
    TextsSectionComponent,
    ButtonsHeaderComponent,
    PillTabsComponent,
    RatingsSectionComponent,
    CardsSectionComponent,
    PlotSectionComponent,
    TitleHeroComponent,
    MoreDetailsComponent,
  ],
  templateUrl: './title-details.component.html',
  styleUrl: './title-details.component.scss',
})
export class TitleDetailsComponent {
  private scrollPosition = 0;
  private routerSubscription!: Subscription;

  constructor(
    protected router: Router,
    private titleDetailsService: TitleDetailsService
  ) {}

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  navigateToNewOutlet() {
    setTimeout(() => {
      window.scrollTo(0, this.scrollPosition);
    }, 50);
  }

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/Back.svg',
      actionCallback: () => {},
    },

    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/title-details/AddToList.svg',
      actionCallback: () => {},
    },
  ];

  tabItemsConfig: PillTabsConfig = {
    mainTabs: {
      tabType: 'navigation',
      buttonContent: 'text',
      tabs: [
        {
          text: 'Details',
          routerLinkPath: 'details',
          visibleOn: ['all'],
        },
        {
          text: 'Seasons',
          routerLinkPath: 'seasons',
          visibleOn: ['series'],
        },
        {
          text: 'Reviews',
          routerLinkPath: 'reviews',
          visibleOn: ['all'],
        },
        {
          text: 'Releases',
          routerLinkPath: 'releases',
          visibleOn: ['movies'],
        },
      ],
    },

    rightTabs1: {
      tabType: 'toggle-switch',
      buttonContent: 'icon',
      tabs: [
        {
          iconPathActive: 'assets/icons/pill-tabs/Calendar-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Calender-grey.svg',
          callback: () => {
            this.titleDetailsService.config.releases.groupBy = 'release-type';
          },
          isSelected: () => {
            return (
              this.titleDetailsService.config.releases.groupBy == 'release-type'
            );
          },
          visibleOn: ['movies/\\d+/releases'],
        },
        {
          iconPathActive: 'assets/icons/pill-tabs/Globe-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Globe-grey.svg',
          callback: () => {
            this.titleDetailsService.config.releases.groupBy = 'country';
          },
          isSelected: () => {
            return (
              this.titleDetailsService.config.releases.groupBy == 'country'
            );
          },
          visibleOn: ['movies/\\d+/releases'],
        },
        {
          iconPathActive: 'assets/icons/pill-tabs/Salida-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Salida-grey.svg',
          callback: () => {
            this.titleDetailsService.config.reviews.reviewsSource = 'salida';
          },
          isSelected: () => {
            return (
              this.titleDetailsService.config.reviews.reviewsSource === 'salida'
            );
          },
          visibleOn: ['reviews'],
        },
        {
          iconPathActive: 'assets/icons/pill-tabs/Tmdb-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Tmdb-grey.svg',
          callback: () => {
            this.titleDetailsService.config.reviews.reviewsSource = 'tmdb';
          },
          isSelected: () => {
            return (
              this.titleDetailsService.config.reviews.reviewsSource === 'tmdb'
            );
          },
          visibleOn: ['reviews'],
        },
      ],
    },

    rightTabs2: {
      tabType: 'toggle-switch',
      buttonContent: 'dynamic-text-then-icon',
      tabs: [
        {
          id: 'season-picker-tab',
          iconPathActive: 'assets/icons/pill-tabs/Arrow-black.svg',
          iconPathDisabled: 'assets/icons/pill-tabs/Arrow-grey.svg',
          dynamicText: () => {
            return this.titleDetailsService.config.seasons.selectedSeason;
          },
          callback: () => {
            this.titleDetailsService.config.seasons.pickerShown = true;
          },
          isSelected: () => {
            return true;
          },
          visibleOn: ['seasons'],
        },
      ],
    },
  };
}
