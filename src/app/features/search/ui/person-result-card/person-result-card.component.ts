import { Component, Input } from '@angular/core';

export interface PersonResultCardProps {
  id: string;
  type: 'person';
  name: string | null;
  originalName: string | null;
  profilePhotoURL: string | null;
  role: string;
  knownForMedia: {
    id: number;
    title: string | null;
    backdropURL: string | null;
    type: 'movie' | 'tv';
    onClick: () => void;
  }[];
  onClick: () => void;
}

@Component({
  selector: 'app-person-result-card',
  imports: [],
  templateUrl: './person-result-card.component.html',
  styleUrl: './person-result-card.component.scss',
})
export class PersonResultCardComponent {
  @Input({ required: true }) props!: PersonResultCardProps;

  onMediaClick(event: Event, onClick: () => void) {
    event.stopPropagation();
    onClick();
  }
}
