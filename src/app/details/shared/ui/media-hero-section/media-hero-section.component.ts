import { Component, DestroyRef, Inject, signal } from '@angular/core';
import { Genre, Image } from '../../../../shared/interfaces/models/tmdb/All';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { WindowResizeService } from '../../../../shared/services/dom/window-resize.service';
import {
  HeaderButtonsComponent,
  HeaderButton,
} from '../../../../shared/components/header-buttons/header-buttons.component';
import { Series } from '../../../../shared/interfaces/models/tmdb/Series';
import { TmdbConfigService } from '../../../../shared/services/tmdb/tmdb-config.service';
import { Movie } from '../../../../shared/interfaces/models/tmdb/Movies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDetectorService } from '../../../../shared/services/dom/scroll-detector.service';
import { PlatformCheckService } from '../../../../shared/services/dom/platform-check.service';

interface TitleMetadata {
  year: string | null;
  rating: string | null;
  runtimeOrSeasons: string | null;
}

export interface HeroSectionData {
  mediaType: 'movie' | 'series';
  title: string;
  metadata: TitleMetadata;
  backdrop_path: string | null;
  logo_path: string | null;
  poster_path: string | null;
  genres: Genre[];
}

@Component({
  selector: 'app-media-hero-section',
  standalone: true,
  imports: [CommonModule, HeaderButtonsComponent],
  templateUrl: './media-hero-section.component.html',
  styleUrl: './media-hero-section.component.scss',
})
export class MediaHeroSectionComponent {
  constructor(
    private seriesDetailsService: SeriesDetailsService,
    private moviesDetailsService: MovieDetailsService,
    private windowResizeService: WindowResizeService,
    private tmdbConfigService: TmdbConfigService,
    private destroyRef: DestroyRef,
    private scrollDetectorService: ScrollDetectorService,
    protected platformCheckSevice: PlatformCheckService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if (this.moviesDetailsService.isMovieRoute) {
      this.setMovieData();
    }
    if (this.seriesDetailsService.isSeriesRoute) {
      this.setSeriesData();
    }
  }

  isLoading = true;
  heroSectionData$!: Observable<HeroSectionData | null>;
  // windows resize service properties
  isResizing = false;
  windowDimensions: { width: number; height: number } | undefined;
  isHeaderBgAndTitleVisibleSig = signal(false);

  heroSectionData: HeroSectionData = {
    mediaType: 'movie',
    title: '',
    metadata: {
      year: '',
      rating: '',
      runtimeOrSeasons: '',
    },
    backdrop_path: null,
    logo_path: null,
    genres: [],
    poster_path: null,
  };

  setMovieData() {
    this.moviesDetailsService.movieData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((movie) => {
          if (!movie) {
            return;
          }

          const heroSectionData: HeroSectionData = {
            mediaType: 'movie',
            title: movie.title,
            metadata: {
              year: this.getMovieYear(movie.release_date),
              rating: this.getLocalReleaseOrFallbackRating(movie, 'movie'),
              runtimeOrSeasons: this.transformToFormattedDuration(
                movie.runtime || 0,
                'minutes',
              ),
            },
            backdrop_path: movie.backdrop_path,
            logo_path: this.getFirstEnglishLogoPath(movie.images.logos),
            genres: movie.genres,
            poster_path: movie.poster_path,
          };

          return heroSectionData;
        }),
        tap((heroSectionData) => {
          heroSectionData ? (this.heroSectionData = heroSectionData) : '';
        }),
      )
      .subscribe();
  }

  setSeriesData() {
    this.seriesDetailsService.seriesData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((series) => {
          if (!series) {
            return;
          }

          const heroSectionData: HeroSectionData = {
            mediaType: 'series',
            title: series.name,
            metadata: {
              year: this.getSeriesYearOrYearRange(
                series.first_air_date,
                series.status,
                series.last_air_date,
              ),
              rating: this.getLocalReleaseOrFallbackRating(series, 'tv'),
              runtimeOrSeasons: this.getSeasonsText(series.number_of_seasons),
            },
            backdrop_path: series.backdrop_path,
            logo_path: this.getFirstEnglishLogoPath(series.images.logos),
            genres: series.genres,
            poster_path: series.poster_path,
          };
          return heroSectionData;
        }),

        tap((data) => {
          if (!data) {
            return;
          }
          this.heroSectionData = data;
          this.isLoading = false;
        }),

        catchError((err) => {
          console.log('failed to fetch series hero section data', err);
          return of(null);
        }),
      )
      .subscribe();
  }

  startSettingHeaderBgAndTitleVisibility() {
    if (this.platformCheckSevice.isServer()) {
      return;
    }

    this.scrollDetectorService.windowScrollState$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((scrollstate) => {
          const remInPixels = parseFloat(
            window.getComputedStyle(document.body).fontSize,
          );

          this.isHeaderBgAndTitleVisibleSig.set(
            (remInPixels === 16 && window.scrollY >= 280) ||
              (remInPixels === 14 && window.scrollY >= 250)
              ? true
              : false,
          );
        }),
      )
      .subscribe((scrollState) => {});
  }

  ngAfterViewInit() {
    this.startSettingHeaderBgAndTitleVisibility();
  }

  ngOnInit(): void {
    this.windowDimensions = { width: 0, height: 0 };

    this.windowResizeService.windowResizeState$.subscribe((state) => {
      takeUntilDestroyed(this.destroyRef), (this.isResizing = state.isResizing);
      this.windowDimensions = state.dimensions;
    });
  }

  getBackropWidth(): string {
    const devWidth = this.windowDimensions?.width || 0;
    if (devWidth <= 360) {
      return 'w780';
    }
    if (devWidth <= 720) {
      return 'w1280';
    } else {
      return 'w1280';
    }
  }

  headerButtons: HeaderButton[] = [
    {
      type: 'icon',
      iconPath: 'assets/icons/header/Back.svg',
      onClickCallback: () => {
        history.back();
      },
    },
    {
      type: 'icon',
      iconPath: 'assets/icons/header/AddToList.svg',
      onClickCallback: () => {},
    },
  ];

  private getFirstEnglishLogoPath(logos: Image[]): string | null {
    const firstEnglishLogoPath = logos?.find(
      (logo) => logo.iso_639_1 === 'en',
    )?.file_path;

    if (firstEnglishLogoPath) {
      return firstEnglishLogoPath;
    } else if (logos[0]) {
      return logos[0].file_path;
    } else {
      return null;
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

      // set local rating if a local rating is found
      seriesRatingString =
        seriesData.content_ratings.results.find(
          (rating) => rating.iso_3166_1 === countryCode,
        )?.rating || null;

      // set the rating to the US rating if no local rating is found
      if (!seriesRatingString) {
        const usRating = seriesData?.content_ratings.results.find(
          (rating) => rating.iso_3166_1 === fallbackCountryCode,
        )?.rating;

        if (usRating) {
          seriesRatingString = usRating + ' (US)';
        }
      }

      // set the first rating it finds if no local or US rating is found
      if (!seriesRatingString) {
        const ratingFound = seriesData?.content_ratings.results.find(
          (rating) => rating.rating,
        );

        seriesRatingString = ratingFound
          ? `${ratingFound.rating} (${ratingFound.iso_3166_1})`
          : '';
      }
      // return the rating string or undefined if no rating is found
      return seriesRatingString ? seriesRatingString : '';
    };

    const getMovieRating = (): string | null => {
      const movieData = mediaData as Movie;
      let moviesRatingString: string | null = null;

      // set local rating if a local rating is found
      moviesRatingString =
        movieData.release_dates.results.find(
          (release) => release.iso_3166_1 === countryCode,
        )?.release_dates[0].certification || null;

      // set the rating to the US rating if no local rating is found
      if (!moviesRatingString) {
        const usRating = movieData.release_dates.results.find(
          (release) => release.iso_3166_1 === fallbackCountryCode,
        )?.release_dates[0].certification;

        if (moviesRatingString) {
          moviesRatingString = usRating + ' (US)';
        }
      }

      // set the first rating it finds if no local or US rating is found
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
          : !lastAirYear()
            ? firstAirYear
            : '';
  }

  private getMovieYear(release_date: string) {
    const airYear = `${String(release_date).replace(/-\d{2}-\d{2}$/, '')}`;
    return release_date ? airYear : null;
  }

  private getMovieRuntime(runtime: number | null) {
    let runtimeString: string | null = null;

    if (runtime) {
      const runtimeHour = Math.floor(runtime / 60);
      const runtimeMin = runtime % 60;
      runtimeString = `${runtimeHour}h ${runtimeMin}m`;
    }
    return runtimeString;
  }

  private transformToFormattedDuration(
    value: number,
    inputUnit: 'seconds' | 'minutes' | 'hours' | 'weeks' = 'seconds',
  ) {
    let seconds: number;
    switch (inputUnit) {
      case 'seconds':
        seconds = value;
        break;
      case 'minutes':
        seconds = value * 60;
        break;
      case 'hours':
        seconds = value * 3600;
        break;
      case 'weeks':
        seconds = value * 604800; // 60 seconds * 60 minutes * 24 hours * 7 days
        break;
      default:
        seconds = value;
    }

    const weeks = Math.floor(seconds / 604800);
    const days = Math.floor((seconds % 604800) / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const weeksString = weeks > 0 ? `${weeks}w ` : '';
    const daysString = days > 0 ? `${days}d ` : '';
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes}m` : '';

    return weeksString + daysString + hoursString + minutesString;
  }

  private getSeasonsText(no_of_seasons: number): string {
    return no_of_seasons > 1
      ? `${no_of_seasons} Seasons`
      : no_of_seasons == 1
        ? `${no_of_seasons} Season`
        : '';
  }
}
