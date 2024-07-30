import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { CardShape } from '../cards-section/cards-section.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() cardShape?: CardShape = 'rectangle';
  @Input() entity: TmdbEntityForCard = {
    name: '',
    image_path: '',
    otherName: '',
  };
}

export interface TmdbEntityForCard {
  name: string;
  otherName?: string;
  image_path: string | null;
}
