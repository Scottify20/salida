import { Component, Input, OnChanges } from '@angular/core';
import {
  SectionHeaderOptions,
  SectionHeaderTitleAndButtonComponent,
} from '../section-header-title-and-button/section-header-title-and-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-texts-section',
  standalone: true,
  imports: [SectionHeaderTitleAndButtonComponent, CommonModule],
  templateUrl: './texts-section.component.html',
  styleUrl: './texts-section.component.scss',
})
export class TextsSectionComponent implements OnChanges {
  @Input() textsSectionOptions: TextsSectionOptions = {
    sectionTitle: '',
    texts: [],
    buttonProps: { type: 'text', textOrIconPath: '', callback: () => {} },
  };

  sectionHeaderOptions: SectionHeaderOptions = {
    sectionTitle: this.textsSectionOptions.sectionTitle,
    buttonProps: this.textsSectionOptions.buttonProps,
  };

  ngOnChanges() {
    this.sectionHeaderOptions = {
      sectionTitle: this.textsSectionOptions.sectionTitle,
      buttonProps: this.textsSectionOptions.buttonProps,
    };
  }
}

export interface TextsSectionOptions extends SectionHeaderOptions {
  texts: string[];
}
