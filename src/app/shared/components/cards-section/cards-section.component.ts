import { Component, OnChanges, SimpleChanges } from '@angular/core';
import {
  SectionHeaderOptions,
  SectionHeaderTitleAndButtonComponent,
} from '../section-header-title-and-button/section-header-title-and-button.component';
import { CardsContainerComponent } from '../cards-container/cards-container.component';
import { Input } from '@angular/core';
import { TmdbEntityForCard } from '../card/card.component';

@Component({
  selector: 'app-cards-section',
  standalone: true,
  imports: [SectionHeaderTitleAndButtonComponent, CardsContainerComponent],
  templateUrl: './cards-section.component.html',
  styleUrl: './cards-section.component.scss',
})
export class CardsSectionComponent implements OnChanges {
  @Input() cardsSectionOptions: CardsSectionOptions = {
    sectionTitle: 'Section Title',
    cardShape: 'rectangle',
    stacking: false,
    entities: [],
    maxNoOfCards: 100,
  };

  sectionHeaderOptions: SectionHeaderOptions = {
    sectionTitle: this.cardsSectionOptions.sectionTitle,
    buttonProps: this.cardsSectionOptions.buttonProps,
  };

  ngOnChanges(): void {
    this.sectionHeaderOptions = {
      sectionTitle: this.cardsSectionOptions.sectionTitle,
      buttonProps: this.cardsSectionOptions.buttonProps,
    };
  }
}

export interface CardsSectionOptions extends SectionHeaderOptions {
  cardShape?: CardShape;
  stacking?: boolean;
  entities: TmdbEntityForCard[];
  maxNoOfCards: number;
}

export type CardShape = 'rectangle' | 'circle';
export type CardSectionButtonType = 'text' | 'icon' | 'none';
