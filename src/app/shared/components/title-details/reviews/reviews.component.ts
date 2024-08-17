import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { Movie } from '../../../interfaces/tmdb/Movies';
import { Series } from '../../../interfaces/tmdb/Series';
import { Observable } from 'rxjs';
import { Review, Reviews } from '../../../interfaces/tmdb/All';
import { CommonModule } from '@angular/common';
import { PillTabsComponent } from '../../pill-tabs/pill-tabs.component';
import { TitleDetailsService } from '../../../services/component-configs/title-details/title-details.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, PillTabsComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private titleDetailsService: TitleDetailsService
  ) {}

  reviewsConfig: ReviewsConfig = this.titleDetailsService.config.reviews;

  tmdbReviews: Reviews = {
    page: 0,
    results: [] as Review[],
    total_pages: 0,
    total_results: 0,
  };

  salidaReviews: Reviews = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  fetchMovieDetails = () => {
    if (!this.isMovie) {
      return null;
    }

    return this.tmdbService.movies
      .getMovieDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Movie) => {
          this.tmdbReviews = data.reviews;
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

    return this.tmdbService.series
      .getSeriesDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Series) => {
          this.tmdbReviews = data.reviews;
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  get isMovie(): boolean {
    return /movies/.test(this.router.url);
  }

  get isSeries(): boolean {
    return /series/.test(this.router.url);
  }

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
}

export interface ReviewsConfig {
  reviewsSource: 'tmdb' | 'salida';
  order: 'newest-first' | 'oldest-first';
}
