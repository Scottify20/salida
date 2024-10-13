import { Component, DestroyRef } from '@angular/core';
import {
  TextsSectionComponent,
  TextsSectionOptions,
} from '../../../../../shared/components/texts-section/texts-section.component';
import {
  CardsSectionComponent,
  CardsSectionOptions,
} from '../../../../../shared/components/cards-section/cards-section.component';
import {
  Series,
  SeriesCastCredit,
  SeriesCrewCredit,
} from '../../../../../shared/interfaces/models/tmdb/Series';
import { tap } from 'rxjs';
import { SeriesDetailsService } from '../../../data-access/series-details.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CollapsibleTextSectionComponent,
  CollapsibleTextSectionOptions,
} from '../../../../../shared/components/collapsible-text-section/collapsible-text-section.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-series-more-details',
  standalone: true,
  imports: [
    TextsSectionComponent,
    CardsSectionComponent,
    CommonModule,
    CollapsibleTextSectionComponent,
  ],
  templateUrl: './series-more-details.component.html',
  styleUrl: './series-more-details.component.scss',
})
export class SeriesMoreDetailsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.seriesDetailsService.seriesData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((series) => {
          if (series) {
            this.seriesData = series;
          }
        }),
      )
      .subscribe();
  }

  seriesData: Series | undefined;

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
    const plot =
      this.seriesDetailsService.isSeriesRoute && this.seriesData?.overview
        ? this.seriesData.overview
        : '';

    return {
      texts: [plot],
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

  get countriesSection(): TextsSectionOptions {
    const countries =
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.origin_country
        : [];

    return {
      sectionTitle: 'Country of Origin',
      sectionTitlePlural: 'Countries of Origin',
      texts: countries,
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
  //       iconPath: 'assets/icons/ratings/Imdb.svg',
  //       ratingValue: '8.4',
  //       providerName: 'Internet Movie Database (IMDb)',
  //     },
  //     {
  //       iconPath: 'assets/icons/ratings/RottenTomatoes.svg',
  //       ratingValue: '',
  //       providerName: 'Rotten Tomatoes',
  //     },
  //     {
  //       iconPath: 'assets/icons/ratings/Tmdb.svg',
  //       ratingValue: '84%',
  //       providerName: 'The Movie Database (TMDB)',
  //     },
  //     {
  //       iconPath: 'assets/icons/ratings/Metacritic.svg',
  //       ratingValue: '',
  //       providerName: 'Metacritic',
  //     },
  //   ],
  // };

  get crewSection(): CardsSectionOptions {
    const getCrewMemberEntity = (crewMember: SeriesCrewCredit) => ({
      id: crewMember.id + crewMember.department,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: (crewMember as SeriesCrewCredit).jobs
        .map((job) => job.job)
        .join(' / '),
      callback: () => {
        this.router.navigate(['/people/', crewMember.id, 'details']);
      },
    });

    const crew =
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.crew.map(getCrewMemberEntity)
        : [];

    return {
      sectionTitle: 'Crew',
      cardShape: 'circle',
      buttonProps: {
        type: 'text',
        textOrIconPath: 'See all',
        callback: () => {},
      },
      maxNoOfCards: 10,
      entities: crew,
    };
  }

  get castSection(): CardsSectionOptions {
    const getCastMemberEntity = (castMember: SeriesCastCredit) => ({
      id: castMember.id + castMember.roles.join('-'),
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: (castMember as SeriesCastCredit).roles[0]?.character ?? '',
      callback: () => {
        this.router.navigate(['/people/', castMember.id, 'details']);
      },
    });

    const cast =
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.cast.map(getCastMemberEntity)
        : [];

    return {
      sectionTitle: 'Cast',
      cardShape: 'circle',
      buttonProps: {
        type: 'text',
        textOrIconPath: 'See all',
        callback: () => {},
      },
      maxNoOfCards: 10,
      entities: cast,
    };
  }
}
