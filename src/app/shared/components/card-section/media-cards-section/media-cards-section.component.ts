import { Component, Input } from '@angular/core';
import {
  SectionTitleProps,
  SectionTitleComponent,
} from '../../section-title/section-title.component';
import { ScrollButtonsComponent } from '../../scroll-buttons/scroll-buttons.component';
import {
  MediaCardComponent,
  MediaCardProps,
} from '../media-card/media-card.component';

@Component({
  selector: 'app-media-cards-section',
  standalone: true,
  imports: [SectionTitleComponent, ScrollButtonsComponent, MediaCardComponent],
  templateUrl: './media-cards-section.component.html',
  styleUrl: './media-cards-section.component.scss',
})
export class MediaCardsSectionComponent {
  @Input() props: MediaCardsSectionProps = {
    sectionTitle: 'Media Section Title',
    titles: [],
    maxNoOfTitles: 100,
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.props.sectionTitle,
    viewAllButtonProps: this.props.viewAllButtonProps,
  };

  ngOnChanges(): void {
    this.sectionTitleOptions = {
      sectionTitle: this.props.sectionTitle,
      viewAllButtonProps: this.props.viewAllButtonProps,
    };
  }
}

export interface MediaCardsSectionProps extends SectionTitleProps {
  titles: MediaCardProps[];
  maxNoOfTitles: number;
}
