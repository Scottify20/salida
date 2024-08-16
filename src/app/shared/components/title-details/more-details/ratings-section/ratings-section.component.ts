import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SectionHeaderTitleAndButtonComponent,
  SectionHeaderOptions,
} from '../../../section-header-title-and-button/section-header-title-and-button.component';
import { Input } from '@angular/core';
import { HeaderBreadCrumbNavigationComponent } from '../../../header-bread-crumb-navigation/header-bread-crumb-navigation.component';

@Component({
  selector: 'app-ratings-section',
  standalone: true,
  imports: [
    SectionHeaderTitleAndButtonComponent,
    HeaderBreadCrumbNavigationComponent,
    CommonModule,
  ],
  templateUrl: './ratings-section.component.html',
  styleUrl: './ratings-section.component.scss',
})
export class RatingsSectionComponent {
  @Input() ratingsSectionOptions: RatingsSectionOptions = {
    sectionTitle: 'Ratings',
    ratings: [],
  };

  sectionHeaderOptions: SectionHeaderOptions = {
    sectionTitle: this.ratingsSectionOptions.sectionTitle,
    buttonProps: this.ratingsSectionOptions.buttonProps,
  };

  ngOnChanges() {
    this.sectionHeaderOptions = {
      sectionTitle: this.ratingsSectionOptions.sectionTitle,
      buttonProps: this.ratingsSectionOptions.buttonProps,
    };
  }
}

export interface RatingsSectionOptions extends SectionHeaderOptions {
  sectionTitle: string;
  ratings: Rating[];
}

interface Rating {
  iconPath: string;
  ratingValue: string;
  providerName: string;
}
