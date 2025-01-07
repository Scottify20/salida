import { Component, Input } from '@angular/core';
import { Episode } from '../../../../../../shared/interfaces/models/tmdb/Series';
import { CommonModule, DatePipe } from '@angular/common';
import { DurationPipe } from '../../../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [DatePipe, CommonModule, DurationPipe],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.scss',
})
export class EpisodeCardComponent {
  @Input() episodeData: Episode = {
    air_date: '',
    episode_number: 0,
    episode_type: 'Regular',
    id: 0,
    name: '',
    overview: '',
    production_code: '',
    runtime: null,
    season_number: 0,
    show_id: 0,
    still_path: null,
    vote_average: 0,
    vote_count: 0,
    crew: [],
    guest_stars: [],
    backdrop_path: null,
    poster_path: null,
    adult: false,
    original_language: '',
    genre_ids: [],
    popularity: 0,
  };
}
