import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IntersectionObserverService } from '../../../shared/services/dom/intersection-observer.service';
import { PlatformCheckService } from '../../../shared/services/dom/platform-check.service';
import { getGenreNames } from '../../../../assets/api-response/tmdb/Genres';
import { ScrollButtonsComponent } from '../../../shared/components/scroll-buttons/scroll-buttons.component';
import { TrendingTitles } from '../../../shared/interfaces/models/tmdb/All';
import { HeroCardComponent } from '../hero-card/hero-card.component';
import { HeroCardsService } from '../../data-access/hero-cards.service';

@Component({
  selector: 'app-hero-cards',
  standalone: true,
  imports: [CommonModule, HeroCardComponent, ScrollButtonsComponent],
  templateUrl: './hero-cards.component.html',
  styleUrl: './hero-cards.component.scss',
})
export class HeroCardsComponent {
  constructor(
    private intersectionObserverService: IntersectionObserverService,
    private platformCheckService: PlatformCheckService,
    private heroCardsService: HeroCardsService,
  ) {}

  indexOfFullyVisibleCard: number = 0;

  @Input() trendingTitles: TrendingTitles = {
    page: 0,
    results: [
      {
        media_type: 'movie',
        backdrop_path: null,
        id: 0,
        overview: '',
        poster_path: null,
        adult: false,
        original_language: '',
        genre_ids: [],
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      },
      {
        media_type: 'movie',
        backdrop_path: null,
        id: 0,
        overview: '',
        poster_path: null,
        adult: false,
        original_language: '',
        genre_ids: [],
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      },
      {
        media_type: 'movie',
        backdrop_path: null,
        id: 0,
        overview: '',
        poster_path: null,
        adult: false,
        original_language: '',
        genre_ids: [],
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      },
      {
        media_type: 'movie',
        backdrop_path: null,
        id: 0,
        overview: '',
        poster_path: null,
        adult: false,
        original_language: '',
        genre_ids: [],
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      },
      {
        media_type: 'movie',
        backdrop_path: null,
        id: 0,
        overview: '',
        poster_path: null,
        adult: false,
        original_language: '',
        genre_ids: [],
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      },
    ],
    total_pages: 0,
    total_results: 0,
  };

  ngAfterViewInit() {
    this.heroCardsService.startScrollDetection();
  }

  get cards(): NodeListOf<Element> | undefined {
    if (this.platformCheckService.isServer()) {
      return undefined;
    } else {
      const cards = document.querySelectorAll('.hero-card');
      return cards ? cards : undefined;
    }
  }

  get posters(): NodeListOf<Element> | undefined {
    if (this.platformCheckService.isBrowser()) {
      const cards = document.querySelectorAll('.hero-card__poster');
      return cards ? cards : undefined;
    }
    return undefined;
  }

  public stopCardsScrollBasedAnimation() {
    this.cards?.forEach((card) => {
      this.intersectionObserverService.unobserve(card);
    });
  }

  public startCardsScrollBasedAnimation() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    const options = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const intersectionHandlerCallback = (
      entries: IntersectionObserverEntry[],
    ) => {
      const entry = entries[0];
      const intersectRatio = entry.intersectionRatio;
      const card = entry.target as HTMLElement;

      const indexOfCard = parseInt(
        card.getAttribute('data-card-index') as string,
      );

      if (intersectRatio >= 0.8) {
        this.indexOfFullyVisibleCard = indexOfCard;
      }

      if (this.indexOfFullyVisibleCard !== indexOfCard) {
        card.style.transform = `scale(${
          0.8 + (1 - 0.8) * intersectRatio + 0.05
        })`;
        card.style.opacity = `${intersectRatio * 100 + 25}%`;
      }
    };

    if (this.cards) {
      this.cards.forEach((card) => {
        const observer = this.intersectionObserverService;
        observer.observe(card, intersectionHandlerCallback, options);
      });
    }
  }

  ngOnDestroy() {
    this.stopCardsScrollBasedAnimation();
  }
}

export interface HeroTitle {
  title: string;
  id: number;
  posterPath: string;
  backdropPath: string;
  plot: string;
  genres: string[];
  logoPath?: string;
  releaseDate?: string;
}
