import { Component, Input, WritableSignal } from '@angular/core';
import {
  SectionTitleComponent,
  SectionTitleProps,
} from '../../section-title/section-title.component';
import { TmdbEntityForCard } from '../person-card/person-card.component';
import { ScrollButtonsComponent } from '../../scroll-buttons/scroll-buttons.component';
import { PersonCardComponent } from '../person-card/person-card.component';

export interface CardsSectionProps extends SectionTitleProps {
  stacking?: boolean;
  entities: TmdbEntityForCard[];
  layout: 'grid' | 'carousel';
  maxNoOfCards: number;
}

export type CardSectionButtonType = 'text' | 'icon' | 'none';

@Component({
  selector: 'app-people-cards-section',
  imports: [SectionTitleComponent, ScrollButtonsComponent, PersonCardComponent],
  templateUrl: './people-cards-section.component.html',
  styleUrl: './people-cards-section.component.scss',
})
export class PeopleCardsSectionComponent {
  ngOnInit() {
    this.sectionTitleOptions.sectionTitle = this.props.sectionTitle;
    this.sectionTitleOptions.viewAllButtonProps = this.props.viewAllButtonProps;
  }

  @Input() props: CardsSectionProps = {
    sectionTitle: 'Section Title',
    stacking: false,
    entities: [],
    maxNoOfCards: 100,
    layout: 'carousel',
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.props.sectionTitle,
    viewAllButtonProps: this.props.viewAllButtonProps,
  };
}
