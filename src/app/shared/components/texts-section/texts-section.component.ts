import { Component, Input, OnChanges } from '@angular/core';
import {
  SectionHeaderOptions,
  SectionHeaderTitleAndButtonComponent,
} from '../section-header-title-and-button/section-header-title-and-button.component';


@Component({
  selector: 'app-texts-section',
  standalone: true,
  imports: [SectionHeaderTitleAndButtonComponent],
  templateUrl: './texts-section.component.html',
  styleUrl: './texts-section.component.scss',
})
export class TextsSectionComponent implements OnChanges {
  @Input() textsSectionOptions: TextsSectionOptions = {
    sectionTitle: '',
    sectionTitlePlural: '',
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

    const pluralTitle = this.textsSectionOptions.sectionTitlePlural;

    if (
      pluralTitle &&
      pluralTitle != '' &&
      this.textsSectionOptions.texts.length > 1
    ) {
      this.sectionHeaderOptions.sectionTitle = pluralTitle;
    }
  }
}

export interface TextsSectionOptions extends SectionHeaderOptions {
  texts: string[];
}
