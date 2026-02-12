import { Component, Input } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';
import { RatingDonutComponent } from '../../rating-donut/rating-donut.component';
import { ListInfo } from '../../../../features/lists/feature/lists-home.component';

export interface MediaCardProps extends MediaSummary {
  onClick?: (listInfo?: ListInfo) => void;
  media_type: 'movie' | 'tv';
  scaling?: 'fixed' | 'auto';
  listInfo?: ListInfo;
  watch_provider_id?: number | null;
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
    scaling: 'fixed',
  };

  @Input({ required: true }) index!: number;

  getPosterAlt() {
    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }

  handleClick() {
    this.props.onClick ? this.props.onClick() : null;
    // this.props.onClick ? this.props.onClick() : console.log('MediaCard clicked, but no onClick handler provided');
  }
}
