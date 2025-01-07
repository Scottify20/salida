import { Component } from '@angular/core';
import { SearchBarComponent } from '../ui/search-bar/search-bar.component';
import {
  HeaderButtonComponent,
  HeaderButtonProps,
} from '../../../shared/components/header-button/header-button.component';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';

import { MediaResultCardComponent } from '../ui/media-result-card/media-result-card.component';
import { SearchPageService } from '../data-access/search-page.service';
import { PersonResultCardComponent } from '../ui/person-result-card/person-result-card.component';

@Component({
  selector: 'app-search-home',
  standalone: true,
  imports: [
    SearchBarComponent,
    HeaderButtonComponent,
    PillIndexedTabsComponent,
    MediaResultCardComponent,
    PersonResultCardComponent,
  ],
  templateUrl: '../ui/search-home/search-home.component.html',
  styleUrl: '../ui/search-home/search-home.component.scss',
})
export class SearchHomeComponent {
  constructor(protected searchPageService: SearchPageService) {}

  pillTabsProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    animationType: 'none',
    tabs: [
      {
        text: 'All',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('all');
          this.searchPageService.triggerSearch(
            this.searchPageService.searchPreferences.all.query(),
          );
        },
      },
      {
        text: 'Movies',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('movie');
          this.searchPageService.triggerSearch(
            this.searchPageService.searchPreferences.all.query(),
          );
        },
      },
      {
        text: 'Series',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('series');
          this.searchPageService.triggerSearch(
            this.searchPageService.searchPreferences.all.query(),
          );
        },
      },
      {
        text: 'People',
        onClickCallback: () => {
          this.searchPageService.searchPreferences.searchType.set('person');
          this.searchPageService.triggerSearch(
            this.searchPageService.searchPreferences.all.query(),
          );
        },
      },
    ],
  };

  backButtonProps: HeaderButtonProps = {
    type: 'icon',
    iconPath: 'assets/icons/header/Back.svg',
  };
}
