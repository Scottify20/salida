import { Component } from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';
import {
  Review,
  Reviews,
} from '../../../../../shared/interfaces/models/tmdb/All';
import { CommonModule } from '@angular/common';
import {
  ReviewsPreferences,
  TemporaryUserPreferencesService,
} from '../../../../../shared/services/preferences/temporary-user-preferences-service';
import { Movie } from '../../../../../shared/interfaces/models/tmdb/Movies';
import { Series } from '../../../../../shared/interfaces/models/tmdb/Series';
import { CollapsibleTextSectionComponent } from '../../../../../shared/components/collapsible-text-section/collapsible-text-section.component';

import removeMd from 'remove-markdown';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, CollapsibleTextSectionComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private moviesDetailsService: MovieDetailsService,
    private preferencesService: TemporaryUserPreferencesService,
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

          const resultsRemovedMarkdown = data.reviews.results.map(
            (review: Review) => ({
              ...review,
              content: removeMd(review.content),
            }),
          );

          return { ...data.reviews, results: resultsRemovedMarkdown.reverse() };
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
        }),
      )
      .subscribe();

    this.reviewsConfigSubscription = this.preferencesService.preferences$
      .pipe(
        tap((preferences) => {
          this.reviewsConfig =
            preferences.details.movieAndSeriesDetails.reviews;
        }),
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
