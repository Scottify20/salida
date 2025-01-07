import { Component, Input } from '@angular/core';

export interface PersonResultCardProps {
  id: number;
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
  standalone: true,
  imports: [],
  templateUrl: './person-result-card.component.html',
  styleUrl: './person-result-card.component.scss',
})
export class PersonResultCardComponent {
  @Input({ required: true }) props!: PersonResultCardProps;

  onMediaTitleClick(event: Event, onClick: () => void) {
    event.stopPropagation();
    event.preventDefault();

    onClick();
  }
}
