import { Component, Input } from '@angular/core';
import { SeasonSummary } from '../../../../interfaces/tmdb/Series';

@Component({
  selector: 'app-episode-group',
  standalone: true,
  imports: [],
  templateUrl: './episode-group.component.html',
  styleUrl: './episode-group.component.scss',
})
export class EpisodeGroupComponent {
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
}
