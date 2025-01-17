import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';
import { PlatformCheckService } from '../../../services/dom/platform-check.service';
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
  constructor(private platformCheck: PlatformCheckService) {}

  @Input({ required: true }) props: MediaCardProps = {} as MediaCardProps;

  @Input({ required: true }) index!: number;

  getPosterAlt() {
    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }
}
