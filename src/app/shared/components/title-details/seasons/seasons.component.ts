import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EpisodeGroupComponent } from './episode-group/episode-group.component';
import { Season, SeasonSummary, Series } from '../../../interfaces/tmdb/Series';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { TitleDetailsService } from '../../../services/component-configs/title-details/title-details.service';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [EpisodeGroupComponent],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
})
export class SeasonsComponent {
  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private titleDetailsConfigService: TitleDetailsService
  ) {}

  seasonsSummaries: SeasonSummary[] = [];
  seasonsConfig = this.titleDetailsConfigService;

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

  ngOnInit() {}
}

export interface SeasonsConfig {
  seasons: Season[];
  selectedSeason: string;
}
