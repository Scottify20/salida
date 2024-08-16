import { Component, Input, Inject } from '@angular/core';
import {
  PlotSectionComponent,
  PlotSectionOptions,
} from './plot-section/plot-section.component';
import {
  TextsSectionComponent,
  TextsSectionOptions,
} from '../../texts-section/texts-section.component';
import {
  RatingsSectionComponent,
  RatingsSectionOptions,
} from './ratings-section/ratings-section.component';
import {
  CardsSectionComponent,
  CardsSectionOptions,
} from '../../cards-section/cards-section.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../interfaces/tmdb/Movies';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Series } from '../../../interfaces/tmdb/Series';
import { TmdbEntityForCard } from '../../card/card.component';

@Component({
  selector: 'app-more-details',
  standalone: true,
  imports: [
    CommonModule,
    PlotSectionComponent,
    TextsSectionComponent,
    RatingsSectionComponent,
    CardsSectionComponent,
  ],
  templateUrl: './more-details.component.html',
  styleUrl: './more-details.component.scss',
})
export class MoreDetailsComponent {
  constructor(private tmdbService: TmdbService, protected router: Router) {}

  movieDetails: Movie = {
    adult: false,
    backdrop_path: '',
    budget: 0,
    genres: [],
    homepage: '',
    id: 0,
    imdb_id: '',
    origin_country: [],
    original_language: '',
    original_title: '',
    overview: '',
    popularity: 0,
    poster_path: '',
    production_companies: [],
    production_countries: [],
    release_date: '',
    revenue: 0,
    runtime: 0,
    spoken_languages: [],
    status: '',
    tagline: '',
    title: '',
    video: false,
    vote_average: 0,
    vote_count: 0,
    videos: { results: [] },
    credits: {
      cast: [],
      crew: [],
    },
    external_ids: {
      imdb_id: '',
      wikidata_id: '',
      facebook_id: '',
      instagram_id: '',
      twitter_id: '',
    },
    release_dates: {
      results: [],
    },
    keywords: {
      keywords: [],
    },
    recommendations: {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    'watch/providers': {
      results: {},
    },
    reviews: {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    images: {
      backdrops: [],
      logos: [],
      posters: [],
    },
    media_type: 'movie',
    genre_ids: [],
  };

  seriesDetails: Series = {
    media_type: 'tv',
    created_by: [],
    episode_run_time: [],
    first_air_date: '',
    homepage: '',
    in_production: false,
    languages: [],
    last_air_date: '',
    last_episode_to_air: {
      id: 0,
      name: '',
      overview: '',
      vote_average: 0,
      vote_count: 0,
      air_date: '',
      episode_number: 0,
      episode_type: '',
      production_code: '',
      runtime: 0,
      season_number: 0,
      show_id: 0,
      still_path: '',
    },
    name: '',
    next_episode_to_air: null,
    networks: [],
    number_of_episodes: 0,
    number_of_seasons: 0,
    origin_country: [],
    original_name: '',
    production_companies: [],
    production_countries: [],
    seasons: [],
    spoken_languages: [],
    status: '',
    tagline: '',
    type: '',
    genres: [],
    aggregate_credits: {
      cast: [],
      crew: [],
    },
    external_ids: {
      imdb_id: null,
      freebase_mid: null,
      freebase_id: null,
      tvdb_id: 0,
      tvrage_id: null,
      wikidata_id: null,
      facebook_id: null,
      instagram_id: null,
      twitter_id: null,
    },
    content_ratings: {
      results: [],
    },
    keywords: {
      results: [],
    },
    'watch/providers': {
      results: {},
    },
    reviews: {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    id: 0,
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    original_language: '',
    original_title: '',
    overview: null,
    popularity: 0,
    poster_path: null,
    vote_average: 0,
    vote_count: 0,
    videos: {
      results: [],
    },
    recommendations: {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    images: {
      posters: [],
      backdrops: [],
      logos: [],
    },
  };

  get isMovie(): boolean {
    return /movies/.test(this.router.url);
  }

  get isSeries(): boolean {
    return /series/.test(this.router.url);
  }

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  get titleTypeFromRoute(): string | undefined {
    const matchedTitleType = this.router.url.match(/movies|series/);
    // return movies or series
    return matchedTitleType ? matchedTitleType[0] : undefined;
  }

  fetchMovieDetails = () => {
    if (!this.isMovie) {
      return null;
    }

    return this.tmdbService
      .getMovieDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Movie) => {
          this.movieDetails = data;
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };

  fetchSeriesDetails = () => {
    if (!this.isSeries) {
      return null;
    }
    return this.tmdbService
      .getSeriesDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Series) => {
          this.seriesDetails = data;
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };

  ngOnInit(): void {
    if (!this.titleIdFromRoute) {
      return;
    }

    if (this.isMovie) {
      this.fetchMovieDetails();
    }

    if (this.isSeries) {
      this.fetchSeriesDetails();
    }
  }

  ngOnDestroy() {
    this.fetchMovieDetails()?.unsubscribe();
    this.fetchSeriesDetails()?.unsubscribe();
  }

  get plotSection(): PlotSectionOptions {
    let plot = '';

    if (this.isMovie && this.movieDetails.overview) {
      plot = this.movieDetails.overview;
    }

    if (this.isSeries && this.seriesDetails.overview) {
      plot = this.seriesDetails.overview;
    }

    return {
      sectionTitle: 'Plot',
      texts: [`${plot}`],
      buttonProps: {
        type: 'text',
        textOrIconPath: 'Expand',
        callback: () => {},
      },
    };
  }

  get creatorsSection(): TextsSectionOptions {
    let creators: string[] = [];

    if (this.isSeries && this.seriesDetails.created_by[0]) {
      creators = [
        ...this.seriesDetails.created_by.map((creator) => creator.name),
      ];
    }

    return {
      sectionTitle: 'Creator',
      sectionTitlePlural: 'Creators',
      texts: creators,
    };
  }

  isTextsSectionDoubleColumn(
    sectionA: TextsSectionOptions,
    sectionB: TextsSectionOptions,
    sectionBSeries?: TextsSectionOptions
  ): boolean {
    function itemsLessThanTen(): boolean {
      if (sectionBSeries) {
        return sectionA.texts.length < 10 &&
          sectionB.texts.length < 10 &&
          sectionBSeries.texts.length < 10
          ? true
          : false;
      } else {
        return sectionA.texts.length < 10 && sectionB.texts.length < 10
          ? true
          : false;
      }
    }

    function atleastTwoSections() {
      if (sectionBSeries) {
        return (sectionB.texts[0] || sectionBSeries.texts[0]) &&
          sectionA.texts[0]
          ? true
          : false;
      } else {
        return sectionB.texts[0] && sectionA.texts[0] ? true : false;
      }
    }

    return atleastTwoSections() && itemsLessThanTen() ? true : false;
  }

  get directorsSection(): TextsSectionOptions {
    let directors: string[] = [];

    if (this.isMovie && this.movieDetails.credits.crew[0]) {
      directors = [
        ...this.movieDetails.credits.crew
          .filter((crew) => crew.job === 'Director')
          .map((crew) => crew.name),
      ];
    }

    return {
      sectionTitle: 'Director',
      sectionTitlePlural: 'Directors',
      texts: directors,
    };
  }

  get writersSection(): TextsSectionOptions {
    let writers: string[] = [];

    if (this.isMovie) {
      writers = [
        ...this.movieDetails.credits.crew
          .filter((crew) => crew.department === 'Writing')
          .map((crew) => crew.name),
      ];
    }

    if (this.isSeries) {
      writers = [
        ...this.seriesDetails.aggregate_credits.crew
          .filter((crew) => crew.department === 'Writing')
          .map((crew) => crew.name),
      ];
    }

    return {
      sectionTitle: 'Writer',
      sectionTitlePlural: 'Writers',
      texts: writers,
    };
  }

  get countriesSection(): TextsSectionOptions {
    let countries: string[] = [];

    if (this.isMovie) {
      countries = this.movieDetails.origin_country;
    }

    if (this.isSeries) {
      countries = this.seriesDetails.origin_country;
    }

    return {
      sectionTitle: 'Country of Origin',
      sectionTitlePlural: 'Countries of Origin',
      texts: countries,
    };
  }

  get languagesSection(): TextsSectionOptions {
    let languages: string[] = [];

    if (this.isMovie) {
      languages = this.movieDetails.spoken_languages.map(
        (language) => language.english_name
      );
    }

    if (this.isSeries) {
      languages = this.seriesDetails.spoken_languages.map(
        (language) => language.english_name
      );
    }

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

  get boxOfficeSection() {
    const revenueAmount = this.movieDetails.revenue;
    let revenueAmountString = '0';

    if (revenueAmount > 0) {
      revenueAmountString = `$ ${this.movieDetails.revenue.toLocaleString(
        'en-US'
      )}`;
    }

    return {
      sectionTitle: 'Box Office Earnings',
      texts: [revenueAmountString],
    };
  }

  ratingsSection: RatingsSectionOptions = {
    sectionTitle: 'Ratings',
    ratings: [
      {
        iconPath: 'assets/icons/ratings/Imdb.svg',
        ratingValue: '8.6',
        providerName: 'Internet Movie Database (IMDb)',
      },
      {
        iconPath: 'assets/icons/ratings/RottenTomatoes.svg',
        ratingValue: '92%',
        providerName: 'Rotten Tomatoes',
      },
      {
        iconPath: 'assets/icons/ratings/Tmdb.svg',
        ratingValue: '92%',
        providerName: 'The Movie Database (TMDB)',
      },
      {
        iconPath: 'assets/icons/ratings/Metacritic.svg',
        ratingValue: '79',
        providerName: 'Metacritic',
      },
    ],
  };

  get crewSection(): CardsSectionOptions {
    let crew: TmdbEntityForCard[] = [];

    if (this.isMovie) {
      crew = [
        ...this.movieDetails.credits.crew
          .filter((crew) => crew.profile_path)
          .map((crew) => ({
            name: crew.name,
            image_path: crew.profile_path,
            otherName: crew.job,
          })),
        ...this.movieDetails.credits.crew
          .filter((crew) => !crew.profile_path)
          .map((crew) => ({
            name: crew.name,
            image_path: crew.profile_path,
            otherName: crew.job,
          })),
      ];
    }

    if (this.isSeries) {
      crew = [
        ...this.seriesDetails.aggregate_credits.crew
          .filter((crew) => crew.profile_path)
          .map((crew) => ({
            name: crew.name,
            image_path: crew.profile_path,
            otherName: crew.jobs.map((job) => job.job).join(' / '),
          })),
        ...this.seriesDetails.aggregate_credits.crew
          .filter((crew) => !crew.profile_path)
          .map((crew) => ({
            name: crew.name,
            image_path: crew.profile_path,
            otherName: crew.jobs.join(' / '),
          })),
      ];
    }

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
    let cast: TmdbEntityForCard[] = [];

    if (this.isMovie) {
      cast = [
        ...this.movieDetails.credits.cast
          .filter((cast) => cast.profile_path)
          .map(
            (cast): TmdbEntityForCard => ({
              name: cast.name,
              image_path: cast.profile_path,
              otherName: cast.character,
            })
          ),
        ...this.movieDetails.credits.cast
          .filter((cast) => !cast.profile_path)
          .map(
            (cast): TmdbEntityForCard => ({
              name: cast.name,
              image_path: cast.profile_path,
              otherName: cast.character,
            })
          ),
      ];
    }

    if (this.isSeries) {
      cast = [
        ...this.seriesDetails.aggregate_credits.cast
          .filter((cast) => cast.profile_path)
          .map(
            (cast): TmdbEntityForCard => ({
              name: cast.name,
              image_path: cast.profile_path,
              otherName: cast.roles[0].character,
            })
          ),
        ...this.seriesDetails.aggregate_credits.cast
          .filter((cast) => !cast.profile_path)
          .map(
            (cast): TmdbEntityForCard => ({
              name: cast.name,
              image_path: cast.profile_path,
              otherName: cast.roles[0].character,
            })
          ),
      ];
    }

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
