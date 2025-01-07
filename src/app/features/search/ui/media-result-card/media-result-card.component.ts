import { Component, Input } from '@angular/core';

export interface MediaResultCardProps {
  id: number;
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
  standalone: true,
  imports: [],
  templateUrl: './media-result-card.component.html',
  styleUrl: './media-result-card.component.scss',
})
export class MediaResultCardComponent {
  @Input({ required: true }) props!: MediaResultCardProps;
}
