import { Component, OnChanges, SimpleChanges } from '@angular/core';
import {
  SectionHeaderOptions,
  SectionHeaderTitleAndButtonComponent,
} from '../section-header-title-and-button/section-header-title-and-button.component';
import { CardsContainerComponent } from '../cards-container/cards-container.component';
import { Input } from '@angular/core';
import { TmdbEntityForCard } from '../../../home/home.component';

@Component({
  selector: 'app-cards-section',
  standalone: true,
  imports: [SectionHeaderTitleAndButtonComponent, CardsContainerComponent],
  templateUrl: './cards-section.component.html',
  styleUrl: './cards-section.component.scss',
})
export class CardsSectionComponent implements OnChanges {
  @Input() entities: TmdbEntityForCard[] = [];
  @Input() cardsSectionOptions: CardsSectionOptions = {
    sectionTitle: 'Section Title',
    cardShape: 'rectangle',
    stacking: false,
  };

  sectionHeaderOptions: SectionHeaderOptions = {
    sectionTitle: this.cardsSectionOptions.sectionTitle,
    buttonProps: this.cardsSectionOptions.buttonProps,
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.sectionHeaderOptions = {
      sectionTitle: this.cardsSectionOptions.sectionTitle,
      buttonProps: this.cardsSectionOptions.buttonProps,
    };
  }
}

export interface CardsSectionOptions extends SectionHeaderOptions {
  cardShape?: CardShape;
  stacking?: boolean;
}

export type CardShape = 'rectangle' | 'circle';
export type CardSectionButtonType = 'text' | 'icon' | 'none';
