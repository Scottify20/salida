import { Component, Input } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';

export interface MediaCardProps extends MediaSummary {
  onClick: () => void;
}

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  @Input() props: MediaCardProps = {} as MediaCardProps;
}
