import { Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EpisodeGroupComponent } from './episode-group/episode-group.component';
import { Season, SeasonSummary, Series } from '../../../interfaces/tmdb/Series';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { TitleDetailsService } from '../../../services/component-configs/title-details/title-details.service';
import {
  AnchoringInfo,
  PopupOrBottomSheetComponent,
} from '../../popup-or-bottom-sheet/popup-or-bottom-sheet.component';
import { ElementPositionService } from '../../../services/element-position.service';
import { PlatformCheckService } from '../../../services/platform-check.service';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [EpisodeGroupComponent, PopupOrBottomSheetComponent],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
})
export class SeasonsComponent {
  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private titleDetailsConfigService: TitleDetailsService,
    private elemPositionService: ElementPositionService,
    private platformCheck: PlatformCheckService
  ) {}
  seasonsSummaries: SeasonSummary[] = [];
  seasonsConfig = this.titleDetailsConfigService;

  anchorElementId = 'season-picker-tab';

  ngAfterViewInit() {}

  get isSeries(): boolean {
    return /series/.test(this.router.url);
  }

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  fetchSeasonsSummaries = () => {
    if (!this.isSeries) {
      return null;
    }
    return this.tmdbService.series
      .getSeriesDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Series) => {
          this.seasonsSummaries = data.seasons;
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };
}

export interface SeasonsConfig {
  seasons: Season[];
  selectedSeason: string;
}
