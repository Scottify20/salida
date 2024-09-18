import { Component } from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';
import { Reviews } from '../../../../shared/interfaces/models/tmdb/All';
import { CommonModule } from '@angular/common';
import {
  ReviewsPreferences,
  TemporaryUserPreferencesService,
} from '../../../../shared/services/preferences/temporary-user-preferences-service';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { Movie } from '../../../../shared/interfaces/models/tmdb/Movies';
import { Series } from '../../../../shared/interfaces/models/tmdb/Series';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
  providers: [provideMarkdown()],
})
export class ReviewsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private moviesDetailsService: MovieDetailsService,
    private preferencesService: TemporaryUserPreferencesService
  ) {
    if (this.moviesDetailsService.isMovieRoute) {
      this.mediaData$ = this.moviesDetailsService.movieData$;
    }

    if (this.seriesDetailsService.isSeriesRoute) {
      this.mediaData$ = this.seriesDetailsService.seriesData$;
    }

    this.mediaData$
      .pipe(
        map((data) => {
          if (!data) {
            return null;
          }
          return data.reviews;
        }),
        tap((reviews) => {
          if (reviews) {
            this.tmdbReviewsData = reviews;
            this.isLoading = false;
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      )
      .subscribe();

    this.reviewsConfigSubscription = this.preferencesService.preferences$
      .pipe(
        tap((preferences) => {
          this.reviewsConfig =
            preferences.details.movieAndSeriesDetails.reviews;
        })
      )
      .subscribe();
  }

  mediaData$: Observable<Movie | Series | null> = of(null);

  isLoading = true;

  private tmdbReviewsDataSubscription!: Subscription;
  tmdbReviewsData: Reviews = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  private reviewsConfigSubscription!: Subscription;
  reviewsConfig: ReviewsPreferences = {
    reviewsSource: 'tmdb',
    dateOrder: 'newest-first',
    ratingOrder: 'highest-first',
    orderBy: 'date',
  };

  salidaReviews: Reviews = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  ngOnDestroy() {
    this.tmdbReviewsDataSubscription?.unsubscribe();
  }
}
