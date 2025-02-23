import { Component, DestroyRef, signal, inject } from '@angular/core';
import { Genre, Image } from '../../../../../shared/interfaces/models/tmdb/All';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import { catchError, debounceTime, fromEvent, map, of, tap } from 'rxjs';

import { WindowResizeService } from '../../../../../shared/services/dom/window-resize.service';
import { HeaderButtonsComponent } from '../../../../../shared/components/header-buttons/header-buttons.component';
import { HeaderButtonProps } from '../../../../../shared/components/header-button/header-button.component';
import { Series } from '../../../../../shared/interfaces/models/tmdb/Series';
import { Movie } from '../../../../../shared/interfaces/models/tmdb/Movies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDetectorService } from '../../../../../shared/services/dom/scroll-detector.service';
import { PlatformCheckService } from '../../../../../shared/services/dom/platform-check.service';
import { MetadataComponent } from '../metadata/metadata.component';
// import { GenresComponent } from '../genres/genres.component';

export interface HeroSectionData {
  mediaType: 'movie' | 'series';
  title: string;
  backdrop_path: string | null;
  logo_path: string | null;
  poster_path: string | null;
}

@Component({
  selector: 'app-media-hero-section',
  imports: [
    HeaderButtonsComponent,
    MetadataComponent
],
  templateUrl: './media-hero-section.component.html',
  styleUrl: './media-hero-section.component.scss',
})
export class MediaHeroSectionComponent {
  private seriesDetailsService = inject(SeriesDetailsService);
  private movieDetailsService = inject(MovieDetailsService);
  private windowResizeService = inject(WindowResizeService);
  private destroyRef = inject(DestroyRef);
  private scrollDetectorService = inject(ScrollDetectorService);
  protected platformCheckSevice = inject(PlatformCheckService);

  constructor() {
    this.initializeHeroSectionData();
  }

  isBackdropLoaded = false;
  isLoading = true;
  isResizing = false;
  windowDimensions: { width: number; height: number } | undefined;
  isHeaderBgAndTitleVisibleSig = signal(false);

  // genresProps: Genre[] = [];

  heroSectionData: HeroSectionData = {
    mediaType: 'movie',
    title: '',
    backdrop_path: null,
    logo_path: null,
    poster_path: null,
  };

  get getBackdropAlt() {
    return this.heroSectionData.mediaType === 'movie'
      ? `${this.heroSectionData.title} movie backdrop`
      : `${this.heroSectionData.title} TV Series backdrop`;
  }

  private initializeHeroSectionData() {
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
        // tap((movie) => {
        //   this.genresProps = movie?.genres || [];
        // }),
        map((movie) => this.mapMovieToHeroSectionData(movie)),
        tap((heroSectionData) => {
          if (heroSectionData) {
            this.heroSectionData = heroSectionData;
          }
        }),
      )
      .subscribe();
  }

  setSeriesData() {
    this.seriesDetailsService.seriesData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // tap((series) => {
        //   this.genresProps = series?.genres || [];
        // }),
        map((series) => this.mapSeriesToHeroSectionData(series)),
        tap((data) => {
          if (data) {
            this.heroSectionData = data;
            this.isLoading = false;
          }
        }),
        catchError((err) => {
          console.log('failed to fetch series hero section data', err);
          return of(null);
        }),
      )
      .subscribe();
  }

  private mapMovieToHeroSectionData(
    movie: Movie | null,
  ): HeroSectionData | null {
    if (!movie) {
      return null;
    }

    return {
      mediaType: 'movie',
      title: movie.title,
      backdrop_path: movie.backdrop_path,
      logo_path: this.getFirstEnglishLogoPath(movie.images.logos),
      poster_path: movie.poster_path,
    };
  }

  private mapSeriesToHeroSectionData(
    series: Series | null,
  ): HeroSectionData | null {
    if (!series) {
      return null;
    }

    return {
      mediaType: 'series',
      title: series.name,
      backdrop_path: series.backdrop_path,
      logo_path: this.getFirstEnglishLogoPath(series.images.logos),
      poster_path: series.poster_path,
    };
  }

  startSettingHeaderBgAndTitleVisibility() {
    if (this.platformCheckSevice.isServer()) {
      return;
    }

    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((scrollState) => {
        const remInPixels = parseFloat(
          window.getComputedStyle(document.body).fontSize,
        );

        this.isHeaderBgAndTitleVisibleSig.set(
          (remInPixels === 16 && window.scrollY >= 320) ||
            (remInPixels === 14 && window.scrollY >= 250)
            ? true
            : false,
        );
      });
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

  headerButtons: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: '/assets/icons/header/Back.svg',
      onClickCallbackFn: () => {
        history.back();
      },
      ariaLabel: 'Go back',
    },
    {
      type: 'icon',
      iconPath: '/assets/icons/header/AddToList.svg',
      onClickCallbackFn: () => {},
      ariaLabel: 'Add this movie or series to a list',
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
}
