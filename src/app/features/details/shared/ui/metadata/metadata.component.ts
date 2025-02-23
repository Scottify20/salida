import { Component, DestroyRef, inject } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Series } from '../../../../../shared/interfaces/models/tmdb/Series';
import { Movie } from '../../../../../shared/interfaces/models/tmdb/Movies';
import { TmdbConfigService } from '../../../../../shared/services/tmdb/tmdb-config.service';
import { FormatService } from '../../../../../shared/services/utility/format.service';

interface TitleMetadata {
  status: string | null;
  year: string | null;
  rating: string | null;
  runtimeOrSeasons: string | null;
}

@Component({
  selector: 'app-metadata',
  imports: [],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
})
export class MetadataComponent {
  private movieDetailsService = inject(MovieDetailsService);
  private seriesDetailsService = inject(SeriesDetailsService);
  private destroyRef = inject(DestroyRef);
  private tmdbConfigService = inject(TmdbConfigService);
  private formatService = inject(FormatService);

  constructor() {
    this.initializeMetadataFetching();
  }

  metadata: TitleMetadata = {
    status: null,
    year: null,
    rating: null,
    runtimeOrSeasons: null,
  };

  private initializeMetadataFetching() {
    if (this.movieDetailsService.isMovieRoute) {
      this.setMovieData();
    }
    if (this.seriesDetailsService.isSeriesRoute) {
      this.setSeriesData();
    }
  }

  setMovieData() {
    this.movieDetailsService.movieData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((movie) => this.mapMovieToMetadata(movie)),
        tap((metadata) => {
          if (metadata) {
            this.metadata = metadata;
          }
        }),
      )
      .subscribe();
  }

  setSeriesData() {
    this.seriesDetailsService.seriesData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((series) => this.mapSeriesToMetadata(series)),
        tap((metadata) => {
          if (metadata) {
            this.metadata = metadata;
          }
        }),
        catchError((err) => {
          console.log('failed to fetch series hero section data', err);
          return of(null);
        }),
      )
      .subscribe();
  }

  private mapMovieToMetadata(movie: Movie | null): TitleMetadata | null {
    if (!movie) {
      return null;
    }

    return {
      status: movie.status,
      year: this.getMovieYear(movie.release_date),
      rating: this.getLocalReleaseOrFallbackRating(movie, 'movie'),
      runtimeOrSeasons: this.formatService.formatDuration(
        movie.runtime || 0,
        'min',
        ['d', 'h', 'min'],
      ),
    };
  }

  private mapSeriesToMetadata(series: Series | null): TitleMetadata | null {
    if (!series) {
      return null;
    }

    return {
      status: series.status,
      year: this.getSeriesYearOrYearRange(
        series.first_air_date,
        series.status,
        series.last_air_date,
      ),
      rating: this.getLocalReleaseOrFallbackRating(series, 'tv'),
      runtimeOrSeasons: this.getSeasonsText(series.number_of_seasons),
    };
  }

  private getSeriesYearOrYearRange(
    first_air_date: string,
    status: string,
    last_air_date: string,
  ): string {
    const hasEndedOrCancelled = (): boolean => {
      return (
        /cancelled/gi.test(status) ||
        (/ended/gi.test(status) && !!first_air_date && !!last_air_date)
      );
    };

    const firstAirYear = `${String(first_air_date).replace(
      /-\d{2}-\d{2}$/,
      '',
    )}`;

    const lastAirYear = (): string | null => {
      if (!last_air_date) {
        return null;
      }
      return `${String(last_air_date).replace(/-\d{2}-\d{2}$/, '')}`;
    };

    return !firstAirYear && !lastAirYear()
      ? ''
      : firstAirYear === lastAirYear()
        ? firstAirYear
        : hasEndedOrCancelled() && lastAirYear
          ? `${firstAirYear} - ${lastAirYear()}`
          : firstAirYear;
  }

  private getMovieYear(release_date: string) {
    const airYear = `${String(release_date).replace(/-\d{2}-\d{2}$/, '')}`;
    return release_date ? airYear : null;
  }

  private getSeasonsText(no_of_seasons: number): string {
    return no_of_seasons > 1
      ? `${no_of_seasons} Seasons`
      : no_of_seasons == 1
        ? `${no_of_seasons} Season`
        : '';
  }

  getStatusText(status: string | null): string | null {
    switch (status) {
      case 'Returning Series':
        return 'Ongoing';
      case 'Planned':
        return 'Upcoming';
      case 'Released':
        return null;
      case 'Ended':
        return null;
      default:
        return status;
    }
  }

  getLocalReleaseOrFallbackRating(
    mediaData: Series | Movie,
    mediaType: 'movie' | 'tv',
  ): string | null {
    const countryCode = this.tmdbConfigService.localCountryCode;
    const fallbackCountryCode = 'US';

    const getSeriesRating = (): string | null => {
      const seriesData = mediaData as Series;
      let seriesRatingString: string | null = null;

      seriesRatingString =
        seriesData.content_ratings.results.find(
          (rating) => rating.iso_3166_1 === countryCode,
        )?.rating || null;

      if (!seriesRatingString) {
        const usRating = seriesData?.content_ratings.results.find(
          (rating) => rating.iso_3166_1 === fallbackCountryCode,
        )?.rating;

        if (usRating) {
          seriesRatingString = usRating + ' (US)';
        }
      }

      if (!seriesRatingString) {
        const ratingFound = seriesData?.content_ratings.results.find(
          (rating) => rating.rating,
        );

        seriesRatingString = ratingFound
          ? `${ratingFound.rating} (${ratingFound.iso_3166_1})`
          : '';
      }
      return seriesRatingString ? seriesRatingString : '';
    };

    const getMovieRating = (): string | null => {
      const movieData = mediaData as Movie;
      let moviesRatingString: string | null = null;

      moviesRatingString =
        movieData.release_dates.results.find(
          (release) => release.iso_3166_1 === countryCode,
        )?.release_dates[0].certification || null;

      if (!moviesRatingString) {
        const usRating = movieData.release_dates.results.find(
          (release) => release.iso_3166_1 === fallbackCountryCode,
        )?.release_dates[0].certification;

        if (moviesRatingString) {
          moviesRatingString = usRating + ' (US)';
        }
      }

      if (!moviesRatingString) {
        moviesRatingString =
          movieData.release_dates.results
            .map((country) => ({
              iso_3166_1: country.iso_3166_1,
              certification: country.release_dates[0].certification,
            }))
            .find((country) => country.certification)?.certification || null;
      }
      return moviesRatingString ? moviesRatingString : null;
    };

    if (mediaType == 'movie') {
      return getMovieRating();
    } else if (mediaType == 'tv') {
      return getSeriesRating();
    } else {
      return null;
    }
  }

  // getLocalReleaseOrFallbackRating(
  //   mediaData: Series | Movie,
  //   mediaType: 'movie' | 'tv',
  // ): string | null {
  //   const countryCode = this.tmdbConfigService.localCountryCode;
  //   const fallbackCountryCode = 'US';

  //   const getSeriesRating = (): string | null => {
  //     const seriesData = mediaData as Series;
  //     let seriesRatingString: string | null = null;

  //     seriesRatingString =
  //       seriesData.content_ratings.results.find(
  //         (rating) => rating.iso_3166_1 === countryCode
  //       )?.rating?.trim() || null;

  //     if (!seriesRatingString) {
  //       const usRating = seriesData?.content_ratings.results.find(
  //         (rating) => rating.iso_3166_1 === fallbackCountryCode
  //       )?.rating?.trim();

  //       if (usRating) {
  //         seriesRatingString = usRating + ' (US)';
  //       }
  //     }

  //     if (!seriesRatingString) {
  //       const ratingFound = seriesData?.content_ratings.results.find(
  //         (rating) => rating.rating
  //       );

  //       seriesRatingString = ratingFound
  //         ? `${ratingFound.rating.trim()} (${ratingFound.iso_3166_1.trim()})`
  //         : '';
  //     }
  //     return seriesRatingString || '';
  //   };

  //   return getSeriesRating();
  // }
}
