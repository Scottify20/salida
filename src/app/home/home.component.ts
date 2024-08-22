import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { HeroCardsComponent } from './hero-cards/hero-cards.component';
import { ButtonsHeaderComponent } from '../shared/components/buttons-header/buttons-header.component';
import {
  CardsSectionComponent,
  CardsSectionOptions,
} from '../shared/components/cards-section/cards-section.component';
import { HeaderButton } from '../shared/components/buttons-header/buttons-header.component';
import { TmdbEntityForCard } from '../shared/components/card/card.component';
import { Router } from '@angular/router';
import { TmdbService } from '../shared/services/tmdb/tmdb.service';
import { Movie, TrendingMovies } from '../shared/interfaces/tmdb/Movies';
import { Series, TrendingSeries } from '../shared/interfaces/tmdb/Series';
import { TrendingPeople } from '../shared/interfaces/tmdb/People';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [ButtonsHeaderComponent, HeroCardsComponent, CardsSectionComponent],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  protected userPhoto: string = '';

  constructor(private router: Router, private tmdbService: TmdbService) {}

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

  get movies(): TmdbEntityForCard[] {
    return this.trendingMovies.results.map((movie) => ({
      name: movie.title,
      image_path: movie.poster_path || '',
      callback: () => {
        this.router.navigate(['/movies/', movie.id, 'details']);
      },
    }));
  }
  get series(): TmdbEntityForCard[] {
    return this.trendingSeries.results.map((series) => ({
      name: series.name,
      image_path: series.poster_path || '',
      callback: () => {
        this.router.navigate(['/series/', series.id, 'details']);
      },
    }));
  }
  get persons(): TmdbEntityForCard[] {
    return this.trendingPeople.results.map((person) => ({
      name: person.name,
      image_path: person.profile_path,
      callback: () => {
        this.router.navigate(['/people/', person.id, 'details']);
      },
    }));
  }

  @ViewChild(HeroCardsComponent) heroCards!: HeroCardsComponent;

  ngAfterViewInit() {
    this.heroCards.startCardsScrollBasedAnimation();
  }

  get trendingMoviesOptions(): CardsSectionOptions {
    return {
      sectionTitle: 'Movies',
      entities: this.movies,
      maxNoOfCards: 20,
      buttonProps: {
        type: 'text',
        textOrIconPath: 'See all',
        callback: this.sampleCallback,
      },
    };
  }
  get trendingSeriesOptions(): CardsSectionOptions {
    return {
      sectionTitle: 'TV Series',
      maxNoOfCards: 20,
      entities: this.series,
      buttonProps: {
        type: 'text',
        textOrIconPath: 'See all',
        callback: this.sampleCallback,
      },
    };
  }
  get trendingPeopleOptions(): CardsSectionOptions {
    return {
      sectionTitle: 'People',
      entities: this.persons,
      maxNoOfCards: 20,
      buttonProps: {
        type: 'text',
        textOrIconPath: 'See all',
        callback: this.sampleCallback,
      },
      cardShape: 'circle',
    };
  }

  fetchTrendingMovies = () => {
    return this.tmdbService.movies.getTrendingMovies('day').subscribe({
      next: (data: TrendingMovies) => {
        this.trendingMovies = data;
      },
      error: (err) => {
        this.router.navigateByUrl('/not-found');
      },
    });
  };
  fetchTrendingSeries = () => {
    return this.tmdbService.series.getTrendingSeries('day').subscribe({
      next: (data: TrendingSeries) => {
        this.trendingSeries = data;
      },
      error: (err) => {
        this.router.navigateByUrl('/not-found');
      },
    });
  };
  fetchTrendingPeople = () => {
    return this.tmdbService.people.getTrendingPeople('day').subscribe({
      next: (data: TrendingPeople) => {
        this.trendingPeople = data;
      },
      error: (err) => {
        this.router.navigateByUrl('/not-found');
      },
    });
  };

  ngOnInit(): void {
    this.fetchTrendingMovies();
    this.fetchTrendingSeries();
    this.fetchTrendingPeople();
  }

  ngOnDestroy() {
    this.fetchTrendingMovies()?.unsubscribe;
    this.fetchTrendingSeries()?.unsubscribe;
    this.fetchTrendingPeople()?.unsubscribe;
    this.heroCards.stopCardsScrollBasedAnimation();
  }

  sampleCallback() {}
}
