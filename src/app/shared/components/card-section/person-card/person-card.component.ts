import { Component, Input } from '@angular/core';

export interface TmdbEntityForCard {
  id: number | string;
  name: string;
  otherName?: string;
  image_path: string | null;
  callback: () => void;
  rating?: number;
}

@Component({
  selector: 'app-person-card',
  imports: [],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.scss',
})
export class PersonCardComponent {
  @Input({ required: true }) index!: number;
  @Input({ required: true }) entity: TmdbEntityForCard = {
    name: '',
    image_path: '',
    otherName: '',
    id: 0,
    rating: 0,
    callback: () => {},
  };
}
