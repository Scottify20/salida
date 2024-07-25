import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TmdbEntityForCard } from '../../../home/home.component';
import { NgForOf } from '@angular/common';
import { CardsSectionOptions } from '../cards-section/cards-section.component';
import { ScrollButtonsComponent } from '../scroll-buttons/scroll-buttons.component';

@Component({
  selector: 'app-cards-container',
  standalone: true,
  imports: [CardComponent, NgForOf, ScrollButtonsComponent],
  templateUrl: './cards-container.component.html',
  styleUrl: './cards-container.component.scss',
})
export class CardsContainerComponent {
  @Input() cardSectionOptions: CardsSectionOptions = {
    sectionTitle: 'SectionTitle',
    cardShape: 'rectangle',
    stacking: false,
  };
  @Input() entities: TmdbEntityForCard[] = [];
}
