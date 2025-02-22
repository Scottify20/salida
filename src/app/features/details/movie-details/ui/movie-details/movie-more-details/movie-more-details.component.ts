import { Component, DestroyRef } from '@angular/core';
import { MovieDetailsService } from '../../../data-access/movie-details.service';
import { Movie } from '../../../../../../shared/interfaces/models/tmdb/Movies';
import { tap } from 'rxjs';
import {
  TextsSectionOptions,
  TextsSectionComponent,
} from '../../../../../../shared/components/texts-section/texts-section.component';
import {
  CollapsibleTextSectionOptions,
  CollapsibleTextSectionComponent,
} from '../../../../../../shared/components/collapsible-text-section/collapsible-text-section.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbConfigService } from '../../../../../../shared/services/tmdb/tmdb-config.service';

@Component({
  selector: 'app-movie-more-details',
  imports: [
    CollapsibleTextSectionComponent,
    TextsSectionComponent,
    CommonModule,
  ],
  templateUrl: './movie-more-details.component.html',
  styleUrl: './movie-more-details.component.scss',
})
export class MovieMoreDetailsComponent {
  constructor(
    private movieDetailsService: MovieDetailsService,
    private destroyRef: DestroyRef,
    private tmdbConfigService: TmdbConfigService,
  ) {
    this.movieDetailsService.movieData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((movie) => {
          if (movie) {
            this.movieData = movie;
            this.updateCountryNames();
          }
        }),
      )
      .subscribe();
  }

  movieData: Movie | undefined;
  countries: string[] = [];

  updateCountryNames() {
    if (this.movieData) {
      const countryCodes = this.movieData.origin_country;
      this.tmdbConfigService.getCountryCodes().subscribe(() => {
        this.countries = countryCodes
          .map((code) => this.tmdbConfigService.getCountryNameFromCode(code))
          .filter((name): name is string => name !== undefined);
      });
    }
  }

  isTextsSectionDoubleColumn(
    sectionA: TextsSectionOptions,
    sectionB: TextsSectionOptions,
  ): boolean {
    function itemsLessThanTen(): boolean {
      return sectionA.texts.length < 10 && sectionB.texts.length < 10
        ? true
        : false;
    }

    return itemsLessThanTen() ? true : false;
  }

  get plotSection(): CollapsibleTextSectionOptions {
    const plot = this.movieData?.overview ? this.movieData.overview : '';

    return {
      text: plot,
      maxCutoffLines: 3,
    };
  }

  get writersSection(): TextsSectionOptions {
    const writers = this.movieData
      ? this.movieData.credits.crew
          .filter((crew) => crew.department === 'Writing')
          .map((crew) => crew.name)
      : [];

    return {
      sectionTitle: 'Writer',
      sectionTitlePlural: 'Writers',
      texts: writers,
    };
  }

  get countriesSection(): TextsSectionOptions {
    return {
      sectionTitle: 'Country of Origin',
      sectionTitlePlural: 'Countries of Origin',
      texts: this.countries,
    };
  }

  get languagesSection(): TextsSectionOptions {
    const languages = this.movieData
      ? this.movieData.spoken_languages.map((language) => language.english_name)
      : [];

    return {
      sectionTitle: 'Language',
      sectionTitlePlural: 'Languages',
      texts: languages,
    };
  }

  // awardsSection: TextsSectionOptions = {
  //   sectionTitle: 'Awards',
  //   texts: ['4 nominations'],
  // };

  // ratingsSection: RatingsSectionOptions = {
  //   sectionTitle: 'Ratings',
  //   ratings: [
  //     {
  //       iconPath: '/assets/icons/ratings/Imdb.svg',
  //       ratingValue: '8.4',
  //       providerName: 'Internet Movie Database (IMDb)',
  //     },
  //     {
  //       iconPath: '/assets/icons/ratings/RottenTomatoes.svg',
  //       ratingValue: '',
  //       providerName: 'Rotten Tomatoes',
  //     },
  //     {
  //       iconPath: '/assets/icons/ratings/Tmdb.svg',
  //       ratingValue: '84%',
  //       providerName: 'The Movie Database (TMDB)',
  //     },
  //     {
  //       iconPath: '/assets/icons/ratings/Metacritic.svg',
  //       ratingValue: '',
  //       providerName: 'Metacritic',
  //     },
  //   ],
  // };

  get directorsSection(): TextsSectionOptions {
    const directors =
      this.movieData?.credits.crew
        .filter((crew) => crew.job === 'Director')
        .map((crew) => crew.name) ?? [];

    return {
      sectionTitle: 'Director',
      sectionTitlePlural: 'Directors',
      texts: directors,
    };
  }

  get budgetSection(): TextsSectionOptions {
    const budgetAmount = this.movieData?.budget ?? 0;
    return {
      sectionTitle: 'Budget',
      texts: [
        budgetAmount > 0 ? `$ ${budgetAmount.toLocaleString('en-US')}` : '0',
      ],
    };
  }

  get revenueSection(): TextsSectionOptions {
    const revenueAmount = this.movieData?.revenue ?? 0;
    return {
      sectionTitle: 'Revenue',
      texts: [
        revenueAmount > 0 ? `$ ${revenueAmount.toLocaleString('en-US')}` : '0',
      ],
    };
  }
}
