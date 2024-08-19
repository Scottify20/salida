import { Component } from '@angular/core';
import {
  ButtonsHeaderComponent,
  HeaderButton,
} from '../../buttons-header/buttons-header.component';
import { Observable, Subscription } from 'rxjs';
import { Movie } from '../../../interfaces/tmdb/Movies';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { CommonModule } from '@angular/common';
import {
  WindowResizeService,
  WindowResizeServiceUser,
} from '../../../services/window-resize.service';
import { Series } from '../../../interfaces/tmdb/Series';
import { Genre, Video } from '../../../interfaces/tmdb/All';

@Component({
  selector: 'app-title-hero',
  standalone: true,
  imports: [ButtonsHeaderComponent, CommonModule],
  templateUrl: './title-hero.component.html',
  styleUrl: './title-hero.component.scss',
})
export class TitleHeroComponent implements WindowResizeServiceUser {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private windowResizeService: WindowResizeService
  ) {}

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;

  getBackropWidth(): string {
    const devWidth = this.windowDimensions.width;
    if (devWidth === 0) {
      return '';
    }
    if (devWidth <= 360) {
      return 'w780';
    }
    if (devWidth <= 720) {
      return 'w1280';
    } else {
      return 'w1280';
    }
  }

  titleHeroDetails: TitleHeroDetails = {
    title: '',
    metadata: {
      year: '',
      rating: '',
      runtimeOrSeasons: '',
    },
    backdrop_path: '',
    logo_path: '',
    genres: [],
  };

  movieDetails$: Observable<Movie> | undefined;
  seriesDetails$: Observable<Series> | undefined;

  get titleIdFromRoute(): number | null {
    const stringId = this.route.snapshot.paramMap.get('id');
    return stringId ? parseInt(stringId) : null;
  }

  get isMovie(): boolean {
    return /movies/.test(this.router.url);
  }

  get isSeries(): boolean {
    return /series/.test(this.router.url);
  }

  fetchSeriesDetails = (): Subscription | null => {
    if (!this.isSeries) {
      return null;
    }

    return this.tmdbService.series
      .getSeriesDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Series) => {
          this.titleHeroDetails.title = data.name;
          this.titleHeroDetails.backdrop_path = data.backdrop_path;
          this.titleHeroDetails.genres = data.genres;

          const firstEnglishLogoPath = data.images.logos.find(
            (logo) => logo.iso_639_1 == 'en'
          )?.file_path;

          if (firstEnglishLogoPath) {
            this.titleHeroDetails.logo_path = firstEnglishLogoPath;
          } else {
            setTimeout(() => {
              this.titleHeroDetails.logo_path = data.images.logos[0].file_path;
            }, 300);
          }

          this.titleHeroDetails.metadata = this.getTitleMetadata({
            seriesDetails: data,
          });
        },
        error: (err) => {
          this.router.navigateByUrl('/not-found');
        },
      });
  };

  fetchMovieDetails = (): Subscription | null => {
    if (!this.isMovie) {
      return null;
    }

    return this.tmdbService.movies
      .getMovieDetails(this.titleIdFromRoute as number)
      .subscribe({
        next: (data: Movie) => {
          this.titleHeroDetails.title = data.title;
          this.titleHeroDetails.backdrop_path = data.backdrop_path;
          this.titleHeroDetails.genres = data.genres;

          const firstEnglishLogoPath = data.images.logos.find(
            (logo) => logo.iso_639_1 == 'en'
          )?.file_path;

          if (firstEnglishLogoPath) {
            this.titleHeroDetails.logo_path = firstEnglishLogoPath;
          } else {
            this.titleHeroDetails.logo_path = data.images.logos[0].file_path;
          }

          this.titleHeroDetails.metadata = this.getTitleMetadata({
            movieDetails: data,
          });
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

    this.windowDimensions = { width: 0, height: 0 };

    this._resizeSubscription =
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this._isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });
  }

  ngOnDestroy() {
    this._resizeSubscription?.unsubscribe();
    this._isResizingSubscription?.unsubscribe();
    this.fetchMovieDetails()?.unsubscribe();
    this.fetchSeriesDetails()?.unsubscribe();
  }

  getLocalReleaseOrFallbackRating(heroOrMovieDetails: {
    movieDetails?: Movie;
    seriesDetails?: Series;
  }): string | undefined {
    const { movieDetails, seriesDetails } = heroOrMovieDetails;
    const countryCode = this.tmdbService.localCountryCode;
    const fallbackCountryCode = 'US';

    let rating: string | undefined = undefined;

    const getSeriesRating = (countryCode: string): string | undefined => {
      let localRating = seriesDetails?.content_ratings.results.find(
        (rating) => rating.iso_3166_1 === countryCode
      )?.rating;

      if (!localRating) {
        const usRating = seriesDetails?.content_ratings.results.find(
          (rating) => rating.iso_3166_1 === fallbackCountryCode
        )?.rating;

        localRating = usRating + ' (US)';
      }

      if (localRating === ' (US)') {
        localRating = seriesDetails?.content_ratings.results.find(
          (rating) => rating.rating
        )?.rating;
      }
      return localRating;
    };

    const getMovieRating = (countryCode: string): string | undefined => {
      let localRating = movieDetails?.release_dates.results.find(
        (release) => release.iso_3166_1 === countryCode
      )?.release_dates[0].certification;

      if (!localRating) {
        const usRating = movieDetails?.release_dates.results.find(
          (release) => release.iso_3166_1 === fallbackCountryCode
        )?.release_dates[0].certification;

        localRating = usRating + ' (US)';
      }

      if (localRating === ' (US)') {
        localRating = movieDetails?.release_dates.results
          .map((country) => ({
            iso_3166_1: country.iso_3166_1,
            certification: country.release_dates[0].certification,
          }))
          .find((country) => country.certification)?.certification;
      }
      return localRating;
    };

    if (this.isMovie) {
      rating = getMovieRating(countryCode);
    }

    if (this.isSeries) {
      rating = getSeriesRating(countryCode);
    }

    return rating;
  }

  getTitleMetadata(heroOrMovieDetails: {
    movieDetails?: Movie;
    seriesDetails?: Series;
  }): TitleMetadata {
    const { movieDetails, seriesDetails } = heroOrMovieDetails;

    let metadata: TitleMetadata = {
      year: '',
      rating: '',
      runtimeOrSeasons: '',
    };

    if (movieDetails) {
      const title = movieDetails;
      metadata.year = new String(title.release_date).replace(
        /-\d{2}-\d{2}$/,
        ''
      );

      metadata.rating =
        this.getLocalReleaseOrFallbackRating({ movieDetails }) || '';

      if (title.runtime) {
        const runtimeHour = Math.floor(title.runtime / 60);
        const runtimeMin = title.runtime % 60;

        metadata.runtimeOrSeasons = `${runtimeHour}h ${runtimeMin}m`;
      }
    }

    if (seriesDetails) {
      const title = seriesDetails;

      metadata.year = new String(title.first_air_date).replace(
        /-\d{2}-\d{2}$/,
        ''
      );

      if (
        title.last_air_date &&
        (title.status == 'Cancelled' || title.status == 'Ended')
      ) {
        metadata.year += ` - ${String(title.last_air_date).replace(
          /-\d{2}-\d{2}$/,
          ''
        )}`;
      }

      metadata.rating =
        this.getLocalReleaseOrFallbackRating({ seriesDetails }) || '';
      metadata.runtimeOrSeasons =
        title.number_of_seasons.toString() + ' Seasons';
    }

    return metadata;
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/Back.svg',
      actionCallback: () => {},
    },

    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/title-details/AddToList.svg',
      actionCallback: () => {},
    },
  ];
}

interface TitleMetadata {
  year: string;
  rating: string;
  runtimeOrSeasons: string;
}

interface TitleHeroDetails {
  title: string;
  metadata: TitleMetadata;
  backdrop_path: string | null;
  logo_path: string | null;
  genres: Genre[];
}
