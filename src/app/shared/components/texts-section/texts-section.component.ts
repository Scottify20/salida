import { Component, Input, OnChanges } from '@angular/core';
import {
  SectionTitleProps,
  SectionTitleComponent,
} from '../section-title/section-title.component';

@Component({
    selector: 'app-texts-section',
    imports: [SectionTitleComponent],
    templateUrl: './texts-section.component.html',
    styleUrl: './texts-section.component.scss'
})
export class TextsSectionComponent implements OnChanges {
  @Input() textsSectionOptions: TextsSectionOptions = {
    sectionTitle: '',
    sectionTitlePlural: '',
    texts: [],
    viewAllButtonProps: {
      onClick: () => {
        return false;
      },
    },
  };

  sectionTitleOptions: SectionTitleProps = {
    sectionTitle: this.textsSectionOptions.sectionTitle,
    viewAllButtonProps: this.textsSectionOptions.viewAllButtonProps,
  };

  ngOnChanges() {
    this.sectionTitleOptions = {
      sectionTitle: this.textsSectionOptions.sectionTitle,
      viewAllButtonProps: this.textsSectionOptions.viewAllButtonProps,
    };

    const pluralTitle = this.textsSectionOptions.sectionTitlePlural;

    if (
      pluralTitle &&
      pluralTitle != '' &&
      this.textsSectionOptions.texts.length > 1
    ) {
      this.sectionTitleOptions.sectionTitle = pluralTitle;
    }
  }
}

export interface TextsSectionOptions extends SectionTitleProps {
  texts: string[];
}
