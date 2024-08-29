import { Component, Input } from '@angular/core';
import { Season } from '../../../../shared/interfaces/tmdb/Series';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode-group',
  standalone: true,
  imports: [EpisodeCardComponent, CommonModule],
  templateUrl: './episode-group.component.html',
  styleUrl: './episode-group.component.scss',
})
export class EpisodeGroupComponent {
  @Input() seasonData: Season = {
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
}