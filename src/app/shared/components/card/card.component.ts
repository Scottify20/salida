import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { TmdbEntityForCard } from '../../../home/home.component';
import { CardShape } from '../cards-section/cards-section.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() cardShape?: CardShape = 'rectangle';
  @Input() entity: TmdbEntityForCard = { name: '', image_path: '' };

  get imageWidth() {
    return this.cardShape === 'circle' ? '154' : '185';
  }
}
