import { Component } from '@angular/core';
import { TmdbConfigService } from '../../../../shared/services/tmdb/tmdb-config.service';
import { Country, ReleaseDate } from '../../../../shared/interfaces/tmdb/All';
import { filter, map, of, Subscription, switchMap } from 'rxjs';
import {
  Movie,
  ReleasesOfCountry,
} from '../../../../shared/interfaces/tmdb/Movies';
import {
  MovieReleasesPreferences,
  TemporaryUserPreferencesService,
} from '../../../../shared/services/preferences/temporary-user-preferences-service';
import { MovieDetailsService } from '../../data-access/movie-details.service';
import { ReleaseType } from '../../../../shared/interfaces/tmdb/Movies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './releases.component.html',
  styleUrl: './releases.component.scss',
})
export class ReleasesComponent {
  constructor(
    private movieDetailsService: MovieDetailsService,
    private tmdbConfigService: TmdbConfigService,
    private userPreferencesService: TemporaryUserPreferencesService
  ) {
    this.releasesPreferencesSubscription =
      this.userPreferencesService.preferences$
        .pipe(
          map((preferences) => {
            if (!preferences) {
              return;
            }
            this.releasesPreferences =
              preferences.details.movieDetails.releases;
          })
        )
        .subscribe();

    this.movieDataSubscription = this.movieDetailsService.movieData$
      .pipe(
        switchMap((movieDetails) => {
          if (movieDetails) {
            return this.tmdbConfigService.getCountryCodes().pipe(
              switchMap((countryCodes: Country[]) => {
                this.countryCodes = countryCodes;
                return of(movieDetails);
              })
            );
          } else {
            return of(null);
          }
        }),
        filter((movieDetails): movieDetails is Movie => movieDetails !== null)
      )
      .subscribe({
        next: (movieDetails: Movie) => {
          const results = movieDetails.release_dates.results;
          this.releasesByType = this.toReleasesByReleaseTypes(results);
          this.releasesByCountry = this.toReleasesByCountryName(results);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching release data:', err);
        },
      });
  }

  releasesPreferences!: MovieReleasesPreferences;
  releasesPreferencesSubscription: Subscription | null = null;
  countryCodes: Country[] = [];

  isLoading = true;

  private movieDataSubscription!: Subscription;

  ngOnDestroy() {
    this.releasesPreferencesSubscription?.unsubscribe();
    this.movieDataSubscription?.unsubscribe();
  }

  releasesByCountry: ReleasesOfCountry[] = [];
  releasesByType: ReleasesByReleaseTypes = {
    Premiere: [],
    'Theatrical (limited)': [],
    Theatrical: [],
    Digital: [],
    Physical: [],
    TV: [],
  };

  getCountryNameFromCode(code: string) {
    return this.countryCodes.find((country) => country.iso_3166_1 === code)
      ?.native_name;
  }

  isFirstInReleaseDate(release: ReleaseDate, releases: ReleaseDate[]): boolean {
    // if the release inside the release is 1 then it's release_date is unique
    if (releases.length <= 1) {
      return true;
    }

    // this are the releases that are the first based on its release_date
    const firstReleasesPerDate: ReleaseDate[] = [];
    releases.forEach((release) => {
      if (
        !firstReleasesPerDate.find(
          (firstRelease) => firstRelease.release_date == release.release_date
        )
      ) {
        firstReleasesPerDate.push(release);
      }
    });

    // check if the release is in the firstReleasesPerDate
    if (firstReleasesPerDate.indexOf(release) > -1) {
      return true;
    }
    return false;
  }

  toReleasesByReleaseTypes = (
    results: ReleasesOfCountry[]
  ): ReleasesByReleaseTypes => {
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

      if (this.releasesPreferences.dateOrder === 'newest-first') {
        for (const key in releases) {
          // sort releases to newest first
          releases[key].sort(
            (r1, r2) =>
              new Date(r2.release_date).getTime() -
              new Date(r1.release_date).getTime()
          );
        }
      }
    });
    return releases;
  };

  toReleasesByCountryName(releases: ReleasesOfCountry[]): ReleasesOfCountry[] {
    if (this.releasesPreferences.countryOrder === 'a-z') {
      return releases.sort((c1, c2) => {
        if (c1.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
          return -1; // Move local country to the top
        } else if (c2.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
          return 1; // Move other countries down
        }

        const countryName1 = this.getCountryNameFromCode(
          c1.iso_3166_1
        ) as string;
        const countryName2 = this.getCountryNameFromCode(
          c2.iso_3166_1
        ) as string;

        return countryName1.localeCompare(countryName2);
      });
    } else {
      return releases.sort((c1, c2) => {
        if (c1.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
          return -1; // Move local country to the top
        } else if (c2.iso_3166_1 === this.tmdbConfigService.localCountryCode) {
          return 1; // Move other countries down
        }

        const countryName1 = this.getCountryNameFromCode(
          c1.iso_3166_1
        ) as string;
        const countryName2 = this.getCountryNameFromCode(
          c2.iso_3166_1
        ) as string;

        return countryName2.localeCompare(countryName1);
      });
    }
  }
}

interface ReleasesByReleaseTypes {
  Premiere: ReleaseDate[];
  'Theatrical (limited)': ReleaseDate[];
  Theatrical: ReleaseDate[];
  Digital: ReleaseDate[];
  Physical: ReleaseDate[];
  TV: ReleaseDate[];
  [key: string]: ReleaseDate[];
}
