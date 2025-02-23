import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { TmdbConfigService } from '../../../../../../shared/services/tmdb/tmdb-config.service';
import {
  Country,
  ReleaseDate,
} from '../../../../../../shared/interfaces/models/tmdb/All';
import { filter, of, switchMap } from 'rxjs';
import {
  Movie,
  ReleasesOfCountry,
} from '../../../../../../shared/interfaces/models/tmdb/Movies';
import {
  MovieReleasesPreferences,
  TemporaryUserPreferencesService,
} from '../../../../../../shared/services/preferences/temporary-user-preferences-service';
import { MovieDetailsService } from '../../../data-access/movie-details.service';
import { ReleaseType } from '../../../../../../shared/interfaces/models/tmdb/Movies';
import { CommonModule, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PlatformCheckService } from '../../../../../../shared/services/dom/platform-check.service';

interface ReleasesByReleaseTypes {
  Premiere: ReleaseDate[];
  'Theatrical (limited)': ReleaseDate[];
  Theatrical: ReleaseDate[];
  Digital: ReleaseDate[];
  Physical: ReleaseDate[];
  TV: ReleaseDate[];
  [key: string]: ReleaseDate[];
}

const RELEASE_TYPES = [
  'Premiere',
  'Theatrical (limited)',
  'Theatrical',
  'Digital',
  'Physical',
  'TV',
];

@Component({
  selector: 'app-releases',
  imports: [DatePipe, ScrollingModule, CommonModule],
  templateUrl: './releases.component.html',
  styleUrl: './releases.component.scss',
})
export class ReleasesComponent {
  private movieDetailsService = inject(MovieDetailsService);
  protected tmdbConfigService = inject(TmdbConfigService);
  private userPreferencesService = inject(TemporaryUserPreferencesService);
  private destroyRef = inject(DestroyRef);
  protected platformCheckService = inject(PlatformCheckService);
  private cdr = inject(ChangeDetectorRef);

  countryCodes: Country[] = [];

  releasesByCountry: ReleasesOfCountry[] = [];
  releasesByType: ReleasesByReleaseTypes = RELEASE_TYPES.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as ReleasesByReleaseTypes);

  orderedReleaseTypes = RELEASE_TYPES;

  constructor() {
    effect(() =>
      this.releasesPreferences.groupBy() === 'release-type'
        ? this.loadMovieData()
        : this.loadMovieData(),
    );
  }

  // to prevent glitching of the [sticky-element] s during tab transition
  private elRef: ElementRef = inject(ElementRef);

  ngAfterViewChecked() {
    const el = this.elRef.nativeElement as HTMLElement;
    const stickyEls = Array.from(
      el.querySelectorAll('[sticky-element]'),
    ) as HTMLElement[];

    setTimeout(() => {
      stickyEls.forEach((el) => {
        el.classList.add('sticky');
      });
    }, 350);
  }

  releasesPreferences: MovieReleasesPreferences =
    this.userPreferencesService.preferences.details.movieDetails.releases;
  localCountryCode =
    this.userPreferencesService.preferences.user.localCountryCode;

  // Load movie data and process release dates
  private loadMovieData() {
    this.movieDetailsService.movieData$
      .pipe(
        switchMap((movieDetails) => {
          if (movieDetails) {
            return this.tmdbConfigService.getCountryCodes().pipe(
              switchMap((countryCodes: Country[]) => {
                this.countryCodes = countryCodes;
                return of(movieDetails);
              }),
              takeUntilDestroyed(this.destroyRef),
            );
          } else {
            return of(null);
          }
        }),
        filter((movieDetails): movieDetails is Movie => movieDetails !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (movieDetails: Movie) => {
          const results = movieDetails.release_dates.results;
          if (this.releasesPreferences.groupBy() === 'release-type') {
            this.releasesByType = this.groupReleasesByType(results);
          } else if (this.releasesPreferences.groupBy() === 'country') {
            this.releasesByCountry = this.groupReleasesByCountry(results);
          }
        },
        error: (err) => {
          console.error('Error fetching release data:', err);
        },
      });
  }

  // Check if the release is the first release on the given date
  isFirstReleaseInDate(release: ReleaseDate, releases: ReleaseDate[]): boolean {
    if (releases.length <= 1) {
      return true;
    }

    const firstReleasesPerDate: ReleaseDate[] = [];
    releases.forEach((release) => {
      if (
        !firstReleasesPerDate.find(
          (firstRelease) => firstRelease.release_date == release.release_date,
        )
      ) {
        firstReleasesPerDate.push(release);
      }
    });

    return firstReleasesPerDate.indexOf(release) > -1;
  }

  // Prioritize local country release dates
  private prioritizeLocalCountryReleaseDates(
    items: ReleaseDate[],
    localCountryCode: string,
  ): ReleaseDate[] {
    return items.sort((a, b) => {
      if (a.iso_639_1 === localCountryCode) return -1;
      if (b.iso_639_1 === localCountryCode) return 1;
      return 0;
    });
  }

  // Prioritize local country releases of country
  private prioritizeLocalCountryReleasesOfCountry(
    items: ReleasesOfCountry[],
    localCountryCode: string,
  ): ReleasesOfCountry[] {
    return items.sort((a, b) => {
      if (a.iso_3166_1 === localCountryCode) return -1;
      if (b.iso_3166_1 === localCountryCode) return 1;
      return 0;
    });
  }

  // Sort release dates by preference (latest-first or earliest-first)
  private sortReleaseDatesByPreference(
    releases: ReleaseDate[],
    dateOrder: 'latest-first' | 'earliest-first',
  ): ReleaseDate[] {
    return releases.sort((r1, r2) => {
      const date1 = new Date(r1.release_date).getTime();
      const date2 = new Date(r2.release_date).getTime();
      return dateOrder === 'latest-first' ? date2 - date1 : date1 - date2;
    });
  }

  // Sort release dates by country order (a-z or z-a)
  private sortReleaseDatesByCountryOrder(
    releases: ReleaseDate[],
    countryOrder: 'a-z' | 'z-a',
  ): ReleaseDate[] {
    return releases.sort((a, b) => {
      const countryNameA =
        this.tmdbConfigService.getCountryNameFromCode(a.iso_639_1) || '';
      const countryNameB =
        this.tmdbConfigService.getCountryNameFromCode(b.iso_639_1) || '';
      return countryOrder === 'a-z'
        ? countryNameA.localeCompare(countryNameB)
        : countryNameB.localeCompare(countryNameA);
    });
  }

  // Group releases by type and sort them based on preferences
  private groupReleasesByType(
    results: ReleasesOfCountry[],
  ): ReleasesByReleaseTypes {
    const releases: ReleasesByReleaseTypes = {
      Premiere: [],
      'Theatrical (limited)': [],
      Theatrical: [],
      Digital: [],
      Physical: [],
      TV: [],
    };

    results.forEach((country) => {
      const countryCode = country.iso_3166_1;

      country.release_dates.forEach((releaseDate) => {
        const releaseCopy: ReleaseDate = releaseDate;
        releaseCopy.iso_639_1 = countryCode;

        switch (releaseCopy.type) {
          case ReleaseType.Premiere:
            releases.Premiere.push(releaseCopy);
            break;
          case ReleaseType['Theatrical (limited)']:
            releases['Theatrical (limited)'].push(releaseCopy);
            break;
          case ReleaseType.Theatrical:
            releases.Theatrical.push(releaseCopy);
            break;
          case ReleaseType.Digital:
            releases.Digital.push(releaseCopy);
            break;
          case ReleaseType.Physical:
            releases.Physical.push(releaseCopy);
            break;
          case ReleaseType.TV:
            releases.TV.push(releaseCopy);
            break;
        }
      });
    });

    const sortedReleases: ReleasesByReleaseTypes = { ...releases };

    RELEASE_TYPES.forEach((type) => {
      sortedReleases[type] = this.sortReleaseDatesByPreference(
        sortedReleases[type],
        this.releasesPreferences.dateOrder(),
      );

      const groupedByDate: { [key: string]: ReleaseDate[] } = {};
      sortedReleases[type].forEach((release) => {
        const date = release.release_date;
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        groupedByDate[date].push(release);
      });

      sortedReleases[type] = [];
      Object.keys(groupedByDate).forEach((date) => {
        let releasesOnDate = groupedByDate[date];
        releasesOnDate = this.sortReleaseDatesByCountryOrder(
          releasesOnDate,
          this.releasesPreferences.countryOrder(),
        );
        if (this.releasesPreferences.showLocalCountryFirst()) {
          releasesOnDate = this.prioritizeLocalCountryReleaseDates(
            releasesOnDate,
            this.localCountryCode() || this.tmdbConfigService.localCountryCode,
          );
        }
        sortedReleases[type] = sortedReleases[type].concat(releasesOnDate);
      });
    });

    // console.log('Grouped Releases by Type:', sortedReleases);
    return sortedReleases;
  }

  // Group releases by country and sort them based on preferences
  private groupReleasesByCountry(
    releases: ReleasesOfCountry[],
  ): ReleasesOfCountry[] {
    const sortByCountryName = (
      c1: ReleasesOfCountry,
      c2: ReleasesOfCountry,
    ) => {
      const countryName1 = this.tmdbConfigService.getCountryNameFromCode(
        c1.iso_3166_1,
      ) as string;
      const countryName2 = this.tmdbConfigService.getCountryNameFromCode(
        c2.iso_3166_1,
      ) as string;
      return countryName1.localeCompare(countryName2);
    };

    const sortedReleases = releases.sort((c1, c2) => {
      if (c1.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
        return -1;
      } else if (c2.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
        return 1;
      }

      return this.releasesPreferences.countryOrder() === 'a-z'
        ? sortByCountryName(c1, c2)
        : sortByCountryName(c2, c1);
    });

    const prioritizedReleases = this.releasesPreferences.showLocalCountryFirst()
      ? this.prioritizeLocalCountryReleasesOfCountry(
          sortedReleases,
          this.localCountryCode() || this.tmdbConfigService.localCountryCode,
        )
      : sortedReleases;

    // console.log('Grouped Releases by Country:', prioritizedReleases);
    return prioritizedReleases;
  }
}
