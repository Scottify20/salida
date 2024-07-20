import { Component } from '@angular/core';
import { SectionHeaderTitleAndButtonComponent } from '../section-header-title-and-button/section-header-title-and-button.component';
import { CardsContainerComponent } from '../cards-container/cards-container.component';

@Component({
  selector: 'app-titles-cards-section',
  standalone: true,
  imports: [SectionHeaderTitleAndButtonComponent, CardsContainerComponent],
  templateUrl: './titles-cards-section.component.html',
  styleUrl: './titles-cards-section.component.scss',
})
export class TitlesCardsSectionComponent {}
