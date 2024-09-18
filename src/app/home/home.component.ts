import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HeroCardsComponent } from './hero-cards/hero-cards.component';
import { ButtonsHeaderComponent } from '../shared/components/buttons-header/buttons-header.component';
import {
  CardsSectionComponent,
  CardsSectionOptions,
} from '../shared/components/cards-section/cards-section.component';
import { HeaderButton } from '../shared/components/buttons-header/buttons-header.component';
import { Router } from '@angular/router';
import { TmdbService } from '../shared/services/tmdb/tmdb.service';
import {
  MovieSummary,
  TrendingMovies,
} from '../shared/interfaces/models/tmdb/Movies';
import {
  SeriesSummary,
  TrendingSeries,
} from '../shared/interfaces/models/tmdb/Series';
import { TrendingPeople } from '../shared/interfaces/models/tmdb/People';
import {
  MediaSummary,
  TrendingTitles,
} from '../shared/interfaces/models/tmdb/All';
import { Subscription } from 'rxjs';
import { SeriesDetailsService } from '../details/series-details/data-access/series-details.service';
import { MovieDetailsService } from '../details/movie-details/data-access/movie-details.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ButtonsHeaderComponent, HeroCardsComponent, CardsSectionComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private seriesDetailService: SeriesDetailsService,
    private movieDetailsService: MovieDetailsService
  ) {}

  @ViewChild(HeroCardsComponent) heroCards!: HeroCardsComponent;

  protected userPhoto: string = '';

  private trendingTitlesSubscription!: Subscription;
  private trendingMoviesSubscription!: Subscription;
  private trendingSeriesSubscription!: Subscription;
  private trendingPeopleSubscription!: Subscription;

  ngOnInit(): void {
    // this.fetchTrendingTitles();
    this.fetchTrendingMovies();
    this.fetchTrendingSeries();
    this.fetchTrendingPeople();
  }

  ngOnDestroy() {
    this.trendingTitlesSubscription?.unsubscribe();
    this.trendingMoviesSubscription?.unsubscribe();
    this.trendingSeriesSubscription?.unsubscribe();
    this.trendingPeopleSubscription?.unsubscribe();
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'icon',
      iconPath: '../../../../assets/icons/home-header/Github-solid.svg',
      anchor: {
        urlType: 'external',
        path: 'https://github.com/Scottify20/salida',
        target: '_blank',
      },
    },
    {
      type: 'text',
      text: 'Logo',
      anchor: {
        urlType: 'internal',
        path: '/',
        target: '_self',
      },
    },
    {
      type: 'icon',
      iconPath: '../../../../assets/icons/home-header/User-solid.svg',
      anchor: {
        urlType: 'internal',
        path: '/user',
        target: '_self',
      },
    },
  ];

  trendingMovies: TrendingMovies = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };
  trendingSeries: TrendingSeries = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };
  trendingPeople: TrendingPeople = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };
  trendingTitles: TrendingTitles = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  trendingMoviesOptions: CardsSectionOptions = {
    sectionTitle: 'Movies',
    entities: [],
    maxNoOfCards: 20,
    buttonProps: {
      type: 'text',
      textOrIconPath: 'See all',
      callback: () => {},
    },
  };
  trendingSeriesOptions: CardsSectionOptions = {
    sectionTitle: 'TV Series',
    maxNoOfCards: 20,
    entities: [],
    buttonProps: {
      type: 'text',
      textOrIconPath: 'See all',
      callback: () => {},
    },
  };
  trendingPeopleOptions: CardsSectionOptions = {
    sectionTitle: 'People',
    entities: [],
    maxNoOfCards: 20,
    buttonProps: {
      type: 'text',
      textOrIconPath: 'See all',
      callback: () => {},
    },
    cardShape: 'circle',
  };

  fetchTrendingMovies = () => {
    this.trendingMoviesSubscription = this.tmdbService.movies
      .getTrendingMovies('day')
      .subscribe({
        next: (data: TrendingMovies) => {
          // push the first 3 movies to the trending titles
          this.pushToTrendingTitles('movie', data.results.slice(0, 3));

          // filters off the first 3 movies then pushes to trending movies section
          this.trendingMoviesOptions.entities = data.results
            .filter((movie, index) => [0, 1, 3].indexOf(index) == -1)
            .map((movie: MovieSummary) => ({
              name: movie.title,
              image_path: movie.poster_path || '',
              callback: () => {
                this.movieDetailsService.viewMovieDetails(
                  movie.id,
                  movie.title
                );
              },
            }));
        },
        error: (err) => {
          console.log('failed to fetch trending movies');
          console.log(err);
        },
      });
  };

  fetchTrendingSeries = () => {
    this.trendingSeriesSubscription = this.tmdbService.series
      .getTrendingSeries('day')
      .subscribe({
        next: (data: TrendingSeries) => {
          // push the first 2 series to the trending titles
          this.pushToTrendingTitles('series', data.results.slice(0, 2));

          // filters off the first 2 series then pushes to trending movies section
          this.trendingSeriesOptions.entities = data.results
            .filter((series, index) => [0, 1].indexOf(index) == -1)
            .map((series: SeriesSummary) => ({
              name: series.name,
              image_path: series.poster_path || '',
              callback: () => {
                this.seriesDetailService.viewSeriesDetails(
                  series.id,
                  series.name
                );
              },
            }));
        },
        error: (err) => {
          console.log('failed to fetch trending series');
          console.log(err);
        },
      });
  };

  fetchTrendingPeople = () => {
    this.trendingPeopleSubscription = this.tmdbService.people
      .getTrendingPeople('day')
      .subscribe({
        next: (data: TrendingPeople) => {
          this.trendingPeopleOptions.entities = data.results.map((person) => ({
            name: person.name,
            image_path: person.profile_path,
            callback: () => {
              this.router.navigate(['/people/', person.id, 'details']);
            },
          }));
        },
        error: (err) => {
          console.log('failed to fetch trending people');
          console.log(err);
        },
      });
  };

  pushToTrendingTitles(mediaType: 'movie' | 'series', results: MediaSummary[]) {
    // push the mapped first 3 movies to the trending titles
    // this adds a callback function to each movie that views the movie's details when the hero card of the movie is clicked
    if (mediaType == 'movie') {
      const mappedMovies = results.map((movie) => ({
        ...movie,
        callback: () => {
          this.movieDetailsService.viewMovieDetails(
            movie.id,
            movie.title as string
          );
        },
      }));

      this.trendingTitles.results = [
        ...this.trendingTitles.results,
        ...mappedMovies,
      ];
    }

    // push the mapped first 2 series to the trending titles
    // this adds a callback function to each series that views the series's details when the hero card of the series is clicked
    if (mediaType === 'series') {
      const mappedSeries = results.map((series) => ({
        ...series,
        title: series.name,
        callback: () => {
          this.seriesDetailService.viewSeriesDetails(
            series.id,
            series.name as string
          );
        },
      }));

      this.trendingTitles.results = [
        ...this.trendingTitles.results,
        ...mappedSeries,
      ];
    }

    // check if the pushed movies and series are already at least 5 and that their properties have values
    if (
      this.trendingTitles.results.length >= 5 &&
      this.trendingTitles.results.every((title) => title.backdrop_path)
    ) {
      // starts the scroll-based animation on the cards of the hero section
      setTimeout(() => {
        this.heroCards?.startCardsScrollBasedAnimation();
      }, 0);
    }
  }
}
