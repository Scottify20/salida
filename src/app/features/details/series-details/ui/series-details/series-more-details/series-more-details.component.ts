import { Component, DestroyRef } from '@angular/core';
import {
  TextsSectionComponent,
  TextsSectionOptions,
} from '../../../../../../shared/components/texts-section/texts-section.component';
import { Series } from '../../../../../../shared/interfaces/models/tmdb/Series';
import { tap } from 'rxjs';
import { SeriesDetailsService } from '../../../data-access/series-details.service';
import { CommonModule } from '@angular/common';
import {
  CollapsibleTextSectionComponent,
  CollapsibleTextSectionOptions,
} from '../../../../../../shared/components/collapsible-text-section/collapsible-text-section.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbConfigService } from '../../../../../../shared/services/tmdb/tmdb-config.service';
// import { GenresComponent } from '../../../../shared/ui/genres/genres.component';
import {
  Genre,
  Keyword,
} from '../../../../../../shared/interfaces/models/tmdb/All';

@Component({
  selector: 'app-series-more-details',
  imports: [
    TextsSectionComponent,
    CommonModule,
    CollapsibleTextSectionComponent,
    // GenresComponent,
  ],
  templateUrl: './series-more-details.component.html',
  styleUrl: './series-more-details.component.scss',
})
export class SeriesMoreDetailsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
    private tmdbConfigService: TmdbConfigService,
  ) {
    this.seriesDetailsService.seriesData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((series) => {
          if (series) {
            this.seriesData = series;
            this.genres = series.genres;
            this.updateCountryNames();
          }
        }),
      )
      .subscribe();
  }

  seriesData: Series | undefined;
  genres: Genre[] = [];
  countries: string[] = [];

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

  // get keywordsSection(): TextsSectionOptions {
  //   const keywords =
  //     this.seriesData?.keywords.results?.map((keyword) => keyword.name) ?? [];

  //   return {
  //     sectionTitle: '',
  //     sectionTitlePlural: '',
  //     texts: keywords,
  //   };
  // }

  get plotSection(): CollapsibleTextSectionOptions {
    const plot =
      this.seriesDetailsService.isSeriesRoute && this.seriesData?.overview
        ? this.seriesData.overview
        : '';

    return {
      text: plot,
      maxCutoffLines: 3,
    };
  }

  get creatorsSection(): TextsSectionOptions {
    const creators =
      this.seriesData?.created_by?.map((creator) => creator.name) ?? [];

    return {
      sectionTitle: 'Creator',
      sectionTitlePlural: 'Creators',
      texts: creators,
    };
  }

  get writersSection(): TextsSectionOptions {
    const writers =
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.crew
            .filter((crew) => crew.department === 'Writing')
            .map((crew) => crew.name)
        : [];

    return {
      sectionTitle: 'Writer',
      sectionTitlePlural: 'Writers',
      texts: writers,
    };
  }

  updateCountryNames() {
    if (this.seriesData) {
      const countryCodes = this.seriesData.origin_country;
      this.tmdbConfigService.getCountryCodes().subscribe(() => {
        this.countries = countryCodes
          .map((code) => this.tmdbConfigService.getCountryNameFromCode(code))
          .filter((name): name is string => name !== undefined);
      });
    }
  }

  get countriesSection(): TextsSectionOptions {
    return {
      sectionTitle: 'Country of Origin',
      sectionTitlePlural: 'Countries of Origin',
      texts: this.countries,
    };
  }

  get languagesSection(): TextsSectionOptions {
    const languages =
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.spoken_languages.map(
            (language) => language.english_name,
          )
        : [];

    return {
      sectionTitle: 'Language',
      sectionTitlePlural: 'Languages',
      texts: languages,
    };
  }

  awardsSection: TextsSectionOptions = {
    sectionTitle: 'Awards',
    texts: ['4 nominations'],
  };

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
}
