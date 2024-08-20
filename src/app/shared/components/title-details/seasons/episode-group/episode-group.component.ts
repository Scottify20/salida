import { Component, Input, OnInit } from '@angular/core';
import { Season, SeasonSummary } from '../../../../interfaces/tmdb/Series';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import { TmdbService } from '../../../../services/tmdb/tmdb.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode-group',
  standalone: true,
  imports: [EpisodeCardComponent, CommonModule],
  templateUrl: './episode-group.component.html',
  styleUrl: './episode-group.component.scss',
})
export class EpisodeGroupComponent implements OnInit {
  constructor(private tmdbService: TmdbService) {}

  @Input() seasonSummary: SeasonSummary = {
    air_date: null,
    episode_count: 0,
    id: 0,
    name: '',
    overview: '',
    poster_path: null,
    season_number: 0,
    vote_average: 0,
  };

  @Input() seasonId!: number;

  seasonDetails: Season = {
    _id: '',
    air_date: '',
    episodes: [],
    name: '',
    overview: '',
    id: 0,
    poster_path: '',
    season_number: 0,
    vote_average: 0,
    external_ids: {
      tvdb_id: 0,
    },
    images: {
      posters: [],
      backdrops: [],
      logos: [],
    },
  };

  fetchSeasonDetails = () => {
    return this.tmdbService.series
      .getSeasonDetails(this.seasonId, this.seasonSummary.season_number)
      .subscribe({
        next: (data: Season) => {
          this.seasonDetails = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  };

  ngOnInit() {
    this.fetchSeasonDetails();
  }
}
