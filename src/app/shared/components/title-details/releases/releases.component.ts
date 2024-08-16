import { Component } from '@angular/core';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Movie, ReleasesOfCountry } from '../../../interfaces/tmdb/Movies';
import { CommonModule } from '@angular/common';
import { Country, ReleaseDate } from '../../../interfaces/tmdb/All';
import { ReleaseType } from '../../../interfaces/tmdb/Movies';
import { TitleDetailsService } from '../../../services/component-configs/title-details/title-details.service';

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './releases.component.html',
  styleUrl: './releases.component.scss',
})
export class ReleasesComponent {
  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private titleDetailsService: TitleDetailsService
  ) {}

  releasesConfig: ReleasesConfig = {
    groupBy: 'release-type',
    dateOrder: 'newest-first',
    countryOrder: 'a-z',
    localCountryCode: this.tmdbService.localCountryCode,
  };

  countryCodes: Country[] = [];

  fetchCountryCodesAndReleases = () => {
    if (this.isMovie) {
      return this.tmdbService
        .getCountryCodes()
        .pipe(
          switchMap((data: Country[]) => {
            this.countryCodes = data;
            return this.tmdbService.getMovieDetails(
              this.titleIdFromRoute as number
            );
          })
        )
        .subscribe({
          next: (data: Movie) => {
            const results = data.release_dates.results;
            this.releasesByType = this.toReleasesByReleaseTypes(results);
            this.releasesByCountry = this.toReleasesByCountryName(results);
          },
          error: (err) => {
            this.router.navigateByUrl('/not-found');
          },
        });
    } else {
      return null;
    }
  };

  releasesByCountry: ReleasesOfCountry[] = [];
  releasesByType: ReleasesByReleaseTypes = {
    Premiere: [],
    'Theatrical (limited)': [],
    Theatrical: [],
    Digital: [],
    Physical: [],
    TV: [],
  };

  get titleIdFromRoute(): number | undefined {
    const matchedId = this.router.url.match(/\d+/i);
    return matchedId ? parseInt(matchedId[0]) : undefined;
  }

  get isMovie(): boolean {
    return /movies/.test(this.router.url);
  }

  ngOnInit(): void {
    if (this.titleIdFromRoute && this.isMovie) {
      this.releasesConfig = this.titleDetailsService.config.releases;
      this.fetchCountryCodesAndReleases();
    } else {
      this.router.navigateByUrl('/not-found');
    }
  }

  ngOnDestroy() {
    this.fetchCountryCodesAndReleases()?.unsubscribe();
  }

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

      if (this.releasesConfig.dateOrder === 'newest-first') {
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
    if (this.releasesConfig.countryOrder === 'a-z') {
      return releases.sort((c1, c2) => {
        if (c1.iso_3166_1 === this.tmdbService.localCountryCode) {
          return -1; // Move local country to the top
        } else if (c2.iso_3166_1 === this.tmdbService.localCountryCode) {
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
        if (c1.iso_3166_1 === this.tmdbService.localCountryCode) {
          return -1; // Move local country to the top
        } else if (c2.iso_3166_1 === this.tmdbService.localCountryCode) {
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

type DateOrder = 'newest-first' | 'oldest-first';
type CountryNameOrder = 'a-z' | 'z-a';
type ReleaseGroupBy = 'release-type' | 'country';

export interface ReleasesConfig {
  groupBy: ReleaseGroupBy;
  dateOrder: DateOrder;
  countryOrder: CountryNameOrder;
  localCountryCode: string;
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
