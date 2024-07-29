import { Component, Input } from '@angular/core';
import { CardsSectionOptions } from '../cards-section/cards-section.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header-title-and-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header-title-and-button.component.html',
  styleUrl: './section-header-title-and-button.component.scss',
})
export class SectionHeaderTitleAndButtonComponent {
  @Input() sectionHeaderOptions: SectionHeaderOptions = {
    sectionTitle: 'Section Title',
    buttonProps: { type: 'text', textOrIconPath: '', callback: () => {} },
  };
}

export interface SectionHeaderOptions {
  sectionTitle: string;
  buttonProps?: SectionButtonProps;
}

export type SectionButtonProps = {
  type: 'text' | 'icon';
  textOrIconPath: string;
  callback: () => void;
};
