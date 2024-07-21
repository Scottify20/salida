import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class Card {
  @Input() posterUrl: string = '';
  @Input() title: string = '';
}
