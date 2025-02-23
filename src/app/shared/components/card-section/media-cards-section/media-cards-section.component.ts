import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  SectionTitleProps,
  SectionTitleComponent,
} from '../../section-title/section-title.component';
import { ScrollButtonsComponent } from '../../scroll-buttons/scroll-buttons.component';
import {
  MediaCardComponent,
  MediaCardProps,
} from '../media-card/media-card.component';
import { CardsSectionScrollService } from '../../../services/for-components/cards-section-scroll.service';

export interface MediaCardsSectionProps extends SectionTitleProps {
  titles: MediaCardProps[];
  maxNoOfTitles: number;
  id: string;
  layout?: 'grid' | 'carousel';
  saveScrollPosition: boolean;
}

@Component({
  selector: 'app-media-cards-section',
  imports: [SectionTitleComponent, ScrollButtonsComponent, MediaCardComponent],
  templateUrl: './media-cards-section.component.html',
  styleUrl: './media-cards-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCardsSectionComponent {
  @Input({ required: true }) props: MediaCardsSectionProps = {
    layout: 'carousel',
    id: '',
    sectionTitle: 'Media Section Title',
    titles: [],
    maxNoOfTitles: 100,
    saveScrollPosition: false,
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.props.sectionTitle,
    iconURL: this.props.iconURL,
    viewAllButtonProps: this.props.viewAllButtonProps,
  };

  constructor(private cardsScrollService: CardsSectionScrollService) {}

  @ViewChild('cardsContainer') cardsContainerRef!: ElementRef;

  ngAfterViewInit() {
    if (this.props.saveScrollPosition) {
      this.startScrollSaveAndRestore();
    }
  }

  startScrollSaveAndRestore() {
    const containerElement = this.cardsContainerRef.nativeElement;

    if (this.cardsScrollService.positions[this.props.id]) {
      containerElement.scrollLeft =
        this.cardsScrollService.positions[this.props.id];
    }

    this.cardsScrollService.startScrollPositionSaving(
      containerElement,
      this.props.id,
    );
  }

  ngOnChanges(): void {
    this.props.titles.splice(this.props.maxNoOfTitles);

    this.sectionTitleOptions = {
      iconURL: this.props.iconURL,
      sectionTitle: this.props.sectionTitle,
      viewAllButtonProps: this.props.viewAllButtonProps,
    };
  }
}
