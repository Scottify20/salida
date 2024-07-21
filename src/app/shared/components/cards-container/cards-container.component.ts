import { Component, Input } from '@angular/core';
import { Card } from '../card/card.component';
import { Movie } from '../../../home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards-container',
  standalone: true,
  imports: [Card, CommonModule],
  templateUrl: './cards-container.component.html',
  styleUrl: './cards-container.component.scss',
})
export class CardsContainerComponent {
  @Input() movies: Movie[] = [];
}
