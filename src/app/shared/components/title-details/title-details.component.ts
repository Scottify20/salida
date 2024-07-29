import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TextsSectionComponent,
  TextsSectionOptions,
} from '../texts-section/texts-section.component';
import {
  HeaderButton,
  ButtonsHeaderComponent,
} from '../buttons-header/buttons-header.component';
import { PillTabsComponent } from '../pill-tabs/pill-tabs.component';

@Component({
  selector: 'app-title-details',
  standalone: true,
  imports: [TextsSectionComponent, ButtonsHeaderComponent, PillTabsComponent],
  templateUrl: './title-details.component.html',
  styleUrl: './title-details.component.scss',
})
export class TitleDetailsComponent implements OnChanges, OnInit {
  constructor(protected router: Router) {}

  get titleId() {
    return this.router.url.match(/\d+/i);
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/Back.svg',
      actionCallback: () => {},
    },

    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/title-details/AddToList.svg',
      actionCallback: () => {},
    },
  ];

  plotSection: TextsSectionOptions = {
    sectionTitle: 'Plot',
    texts: [
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.',
    ],
    buttonProps: {
      type: 'text',
      textOrIconPath: 'See More',
      callback: () => {},
    },
  };

  directorsSection: TextsSectionOptions = {
    sectionTitle: 'Director',
    texts: ['Dennis Villeneuve'],
  };

  writersSection: TextsSectionOptions = {
    sectionTitle: 'Writer',
    texts: ['Denis Villeneuve', 'Jon Spaihts', 'Frank Herbert'],
  };

  countriesSection: TextsSectionOptions = {
    sectionTitle: 'Country of Origin',
    texts: ['United States', 'Canada', 'United Arab Emirates'],
  };

  languagesSection: TextsSectionOptions = {
    sectionTitle: 'Language',
    texts: ['English'],
  };

  awardsSection: TextsSectionOptions = {
    sectionTitle: 'Awards',
    texts: ['4 nominations'],
  };

  boxOfficeSection: TextsSectionOptions = {
    sectionTitle: 'Box Office Earnings',
    texts: ['$ 282, 144, 358'],
  };

  setPluralSectionTitles() {
    const sectionKeys = Object.keys(this).filter((key) =>
      /^.*section.*$/i.test(key)
    ) as (keyof TitleDetailsComponent)[];

    sectionKeys.forEach((key) => {
      const section = this[key] as TextsSectionOptions;
      const title = section.sectionTitle;

      if (
        section?.texts &&
        section.texts.length > 1 &&
        title[title.length - 1] != 's'
      ) {
        if (section.sectionTitle === 'Country of Origin') {
          section.sectionTitle = 'Countries of Origin';
        } else {
          section.sectionTitle += 's';
        }
      }
    });
  }

  ngOnChanges() {
    this.setPluralSectionTitles();
  }
  ngOnInit(): void {
    this.setPluralSectionTitles();
  }
}
