import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  computed,
  DestroyRef,
} from '@angular/core';
import { HeroCardsComponent } from '../ui/home/hero-cards/hero-cards.component';
import {
  CardsSectionComponent,
  CardsSectionOptions,
} from '../../../shared/components/cards-section/cards-section.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderButton } from '../../../shared/components/header-button/header-button.component';
import { Router } from '@angular/router';
import { TmdbService } from '../../../shared/services/tmdb/tmdb.service';
import {
  MovieSummary,
  TrendingMovies,
} from '../../../shared/interfaces/models/tmdb/Movies';
import {
  SeriesSummary,
  TrendingSeries,
} from '../../../shared/interfaces/models/tmdb/Series';
import { TrendingPeople } from '../../../shared/interfaces/models/tmdb/People';
import {
  MediaSummary,
  TrendingTitles,
} from '../../../shared/interfaces/models/tmdb/All';
import { SeriesDetailsService } from '../../details/series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../details/movie-details/data-access/movie-details.service';
import { UserService } from '../../../core/user/user.service';
import { JsonPipe } from '@angular/common';
import { UserActionsMenuPopoverComponent } from '../ui/home/user-actions-menu-popover/user-actions-menu-popover.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: '../ui/home/home.component.html',
  styleUrls: ['../ui/home/home.component.scss'],
  imports: [
    HeroCardsComponent,
    CardsSectionComponent,
    JsonPipe,
    UserActionsMenuPopoverComponent,
    HeaderButtonsComponent,
  ],
})
export class HomeComponent {
  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private seriesDetailService: SeriesDetailsService,
    private movieDetailsService: MovieDetailsService,
    private userService: UserService,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(HeroCardsComponent) heroCards!: HeroCardsComponent;

  ngOnInit(): void {
    this.fetchTrendingMovies();
    this.fetchTrendingSeries();
    this.fetchTrendingPeople();
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'icon',
      iconPath: '../../../../assets/icons/home-header/Github-solid.svg',
      onClickCallbackFn: () => {
        if (window) {
          window.open('https://github.com/Scottify20/salida', 'blank');
        }
      },
    },
    {
      type: 'text',
      text: 'Logo',
      onClickCallbackFn: () => {
        this.router.navigateByUrl('/');
      },
    },
    {
      id: 'user-button',
      type: 'icon',
      iconPath: this.userService.userPhotoUrlSig,
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
    this.tmdbService.movies
      .getTrendingMovies('day')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: TrendingMovies) => {
          // push the first 3 movies to the trending titles
          this.pushToTrendingTitles('movie', data.results.slice(0, 3));

          // filters off the first 3 movies then pushes to trending movies section
          this.trendingMoviesOptions.entities = data.results
            .filter((movie, index) => [0, 1, 3].indexOf(index) == -1)
            .map((movie: MovieSummary) => ({
              id: movie.id,
              name: movie.title,
              image_path: movie.poster_path || '',
              callback: () => {
                this.movieDetailsService.viewMovieDetails(
                  movie.id,
                  movie.title,
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
    this.tmdbService.series
      .getTrendingSeries('day')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: TrendingSeries) => {
          // push the first 2 series to the trending titles
          this.pushToTrendingTitles('series', data.results.slice(0, 2));

          // filters off the first 2 series then pushes to trending movies section
          this.trendingSeriesOptions.entities = data.results
            .filter((series, index) => [0, 1].indexOf(index) == -1)
            .map((series: SeriesSummary) => ({
              id: series.id,
              name: series.name,
              image_path: series.poster_path || '',
              callback: () => {
                this.seriesDetailService.viewSeriesDetails(
                  series.id,
                  series.name,
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
    this.tmdbService.people
      .getTrendingPeople('day')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: TrendingPeople) => {
          this.trendingPeopleOptions.entities = data.results.map((person) => ({
            id: person.id,
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
      let mappedMovies = results.map((movie) => ({
        ...movie,
        callback: () => {
          this.movieDetailsService.viewMovieDetails(
            movie.id,
            movie.title as string,
          );
        },
      }));

      // remove series that has no poster_path or a backdrop_bath // both paths must be included
      mappedMovies = mappedMovies.filter(
        (movie) => movie.poster_path && movie.backdrop_path,
      );

      this.trendingTitles.results = [
        ...this.trendingTitles.results,
        ...mappedMovies,
      ];
    }

    // push the mapped first 2 series to the trending titles
    // this adds a callback function to each series that views the series's details when the hero card of the series is clicked
    if (mediaType === 'series') {
      let mappedSeries = results.map((series) => ({
        ...series,
        title: series.name,
        callback: () => {
          this.seriesDetailService.viewSeriesDetails(
            series.id,
            series.name as string,
          );
        },
      }));

      // remove series that has no poster_path or a backdrop_bath // both paths must be included
      mappedSeries = mappedSeries.filter(
        (series) => series.poster_path && series.backdrop_path,
      );

      this.trendingTitles.results = [
        ...this.trendingTitles.results,
        ...mappedSeries,
      ];
    }

    // starts the scroll-based animation on the cards of the hero section
    setTimeout(() => {
      this.heroCards?.startCardsScrollBasedAnimation();
    }, 0);
  }
}
