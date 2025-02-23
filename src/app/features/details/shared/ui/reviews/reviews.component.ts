import { Component, ElementRef, signal, inject } from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';
import {
  Review,
  Reviews,
} from '../../../../../shared/interfaces/models/tmdb/All';

import {
  ReviewsSource,
  TemporaryUserPreferencesService,
} from '../../../../../shared/services/preferences/temporary-user-preferences-service';
import { Movie } from '../../../../../shared/interfaces/models/tmdb/Movies';
import { Series } from '../../../../../shared/interfaces/models/tmdb/Series';

import removeMd from 'remove-markdown';
import { ReviewComponent } from '../review/review.component';
import {
  ReviewModalComponent,
  ReviewModalProps,
} from '../../../../../shared/components/review-modal/review-modal.component';

@Component({
  selector: 'app-reviews',
  imports: [ReviewComponent, ReviewModalComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  private seriesDetailsService = inject(SeriesDetailsService);
  private moviesDetailsService = inject(MovieDetailsService);
  private preferencesService = inject(TemporaryUserPreferencesService);

  constructor() {
    this.initializeReviewsFetching();
  }

  reviewsSource: ReviewsSource =
    this.preferencesService.preferences.details.movieAndSeriesDetails.reviews
      .reviewsSource;
  mediaData$: Observable<Movie | Series | null> = of(null);

  reviewModalProps: ReviewModalProps = {
    config: {
      id: 'review-modal',
      isOpenSig: signal(false),
    },
    review: signal(null),
  };

  showReviewModal(review: Review) {
    setTimeout(() => {
      this.reviewModalProps.review.set(review);
      this.reviewModalProps.config.isOpenSig.set(true);
    }, 25);
  }

  initializeReviewsFetching() {
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
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      )
      .subscribe();
  }

  private tmdbReviewsDataSubscription!: Subscription;
  tmdbReviewsData: Reviews = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
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
