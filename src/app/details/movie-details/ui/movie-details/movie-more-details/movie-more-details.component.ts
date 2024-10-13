import { Component, DestroyRef } from '@angular/core';
import { MovieDetailsService } from '../../../data-access/movie-details.service';
import {
  CastCredit,
  Credit,
  Movie,
} from '../../../../../shared/interfaces/models/tmdb/Movies';
import { Subscription, takeUntil, tap } from 'rxjs';
import {
  TextsSectionOptions,
  TextsSectionComponent,
} from '../../../../../shared/components/texts-section/texts-section.component';
import {
  CollapsibleTextSectionOptions,
  CollapsibleTextSectionComponent,
} from '../../../../../shared/components/collapsible-text-section/collapsible-text-section.component';
import { SeriesCrewCredit } from '../../../../../shared/interfaces/models/tmdb/Series';
import {
  CardsSectionOptions,
  CardsSectionComponent,
} from '../../../../../shared/components/cards-section/cards-section.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-more-details',
  standalone: true,
  imports: [
    CollapsibleTextSectionComponent,
    TextsSectionComponent,
    CardsSectionComponent,
    CommonModule,
  ],
  templateUrl: './movie-more-details.component.html',
  styleUrl: './movie-more-details.component.scss',
})
export class MovieMoreDetailsComponent {
  constructor(
    private movieDetailsService: MovieDetailsService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.movieDetailsService.movieData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((movie) => {
          if (movie) {
            this.movieData = movie;
          }
        }),
      )
      .subscribe();
  }

  movieData: Movie | undefined;

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
      texts: [plot],
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
    const countries = this.movieData ? this.movieData.origin_country : [];

    return {
      sectionTitle: 'Country of Origin',
      sectionTitlePlural: 'Countries of Origin',
      texts: countries,
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

  get crewSection(): CardsSectionOptions {
    const getCrewMemberEntity = (crewMember: Credit) => ({
      id: crewMember.id + crewMember.job,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: crewMember.job,
      callback: () => {
        this.router.navigate(['/people/', crewMember.id, 'details']);
      },
    });

    const crew = this.movieData
      ? this.movieData.credits.crew.map(getCrewMemberEntity)
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
    const getCastMemberEntity = (castMember: CastCredit) => ({
      id: castMember.id + castMember.character,
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: castMember.character ?? '',
      callback: () => {
        this.router.navigate(['/people/', castMember.id, 'details']);
      },
    });

    const cast = this.movieData
      ? this.movieData.credits.cast.map(getCastMemberEntity)
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

  get boxOfficeSection(): TextsSectionOptions {
    const revenueAmount = this.movieData?.revenue ?? 0;
    return {
      sectionTitle: 'Box Office Earnings',
      texts: [
        revenueAmount > 0 ? `$ ${revenueAmount.toLocaleString('en-US')}` : '0',
      ],
    };
  }
}
