import { Component, Input } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';

export interface MediaCardProps extends MediaSummary {
  onClick: () => void;
  media_type: 'movie' | 'tv';
}

@Component({
  selector: 'app-media-card',
  imports: [],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  @Input() props: MediaCardProps = {} as MediaCardProps;

  getPosterAlt() {
    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }
}
