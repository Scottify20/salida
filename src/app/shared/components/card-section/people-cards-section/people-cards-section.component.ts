import { Component, Input, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import {
  SectionTitleComponent,
  SectionTitleProps,
} from '../../section-title/section-title.component';
import { TmdbEntityForCard } from '../person-card/person-card.component';
import { ScrollButtonsComponent } from '../../scroll-buttons/scroll-buttons.component';
import { PersonCardComponent } from '../person-card/person-card.component';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CardsSectionProps extends SectionTitleProps {
  stacking?: boolean;
  entities: BehaviorSubject<TmdbEntityForCard[]>;
  layout: 'grid' | 'carousel';
  maxNoOfCards: number;
}

export type CardSectionButtonType = 'text' | 'icon' | 'none';

@Component({
  selector: 'app-people-cards-section',
  imports: [
    SectionTitleComponent,
    ScrollButtonsComponent,
    PersonCardComponent,
    AsyncPipe,
  ],
  templateUrl: './people-cards-section.component.html',
  styleUrl: './people-cards-section.component.scss',
})
export class PeopleCardsSectionComponent {
  constructor(private destroyRef: DestroyRef) {}

  ngOnInit() {
    this.sectionTitleOptions.sectionTitle = this.props.sectionTitle;
    this.sectionTitleOptions.viewAllButtonProps = this.props.viewAllButtonProps;
    this.props.entities.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  @Input() props: CardsSectionProps = {
    sectionTitle: 'Section Title',
    stacking: false,
    entities: new BehaviorSubject<TmdbEntityForCard[]>([]),
    maxNoOfCards: 100,
    layout: 'carousel',
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.props.sectionTitle,
    viewAllButtonProps: this.props.viewAllButtonProps,
  };
}
