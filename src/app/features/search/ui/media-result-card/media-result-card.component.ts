import { Component, Input } from '@angular/core';

export interface MediaResultCardProps {
  id: string;
  type: 'series' | 'movie';
  title: string | undefined;
  original_title: string | undefined;
  posterURL: string | null;
  metadata: (string | null)[];
  onClick: () => void;
  genres?: string[];
  overview?: string;
}

@Component({
  selector: 'app-media-result-card',
  imports: [],
  templateUrl: './media-result-card.component.html',
  styleUrl: './media-result-card.component.scss',
})
export class MediaResultCardComponent {
  @Input({ required: true }) props!: MediaResultCardProps;

  getPosterAlt() {
    return this.props.type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.title} TV Series poster`;
  }
}
