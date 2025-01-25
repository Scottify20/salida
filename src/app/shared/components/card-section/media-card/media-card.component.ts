import { Component, Input } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';
import { RatingDonutComponent } from '../../rating-donut/rating-donut.component';

export interface MediaCardProps extends MediaSummary {
  onClick: () => void;
  media_type: 'movie' | 'tv';
}

@Component({
  selector: 'app-media-card',
  imports: [RatingDonutComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  @Input({ required: true }) props: MediaCardProps = {
    onClick: () => {},
    media_type: 'movie',
    id: 0,
    backdrop_path: null,
    overview: '',
    poster_path: null,
    adult: false,
    original_language: '',
    genre_ids: [],
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
  };

  @Input({ required: true }) index!: number;

  getPosterAlt() {
    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }
}
