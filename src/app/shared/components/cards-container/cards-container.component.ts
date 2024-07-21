import { Component, OnInit } from '@angular/core';
import { CardPosterAndTitleComponent } from '../card/card.component';

@Component({
  selector: 'app-cards-container',
  standalone: true,
  imports: [CardPosterAndTitleComponent],
  templateUrl: './cards-container.component.html',
  styleUrl: './cards-container.component.scss',
})
export class CardsContainerComponent {}
