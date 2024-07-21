import { Component } from '@angular/core';
import { SectionHeaderTitleAndButtonComponent } from '../section-header-title-and-button/section-header-title-and-button.component';
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
export class CardsSectionComponent {
  @Input() entities: TmdbEntityForCard[] = [];
  @Input() cardsSectionOptions: CardsSectionOptions = {
    sectionTitle: 'Section Title',
    cardShape: 'rectangle',
    stacking: false,
  };
}

export interface CardsSectionOptions {
  sectionTitle: string;
  cardShape?: CardShape;
  buttonProps?: CardSectionButtonProps;
  stacking?: boolean;
}

export type CardShape = 'rectangle' | 'circle';

export type CardSectionButtonType = 'text' | 'icon' | 'none';

export type CardSectionButtonProps = {
  type: 'text' | 'icon';
  textOrIconPath: string;
  callback: () => void;
};
