import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemporaryUserPreferencesService {
  private _preferences = new BehaviorSubject<UserPreferences>(
    this.defaultPreferences
  );

  preferences$: Observable<UserPreferences> = this._preferences.asObservable();

  private get defaultPreferences(): UserPreferences {
    return {
      theme: {
        colorScheme: 'dark',
        accentColor: '#FFFFFF',
      },
      details: {
        movieAndSeriesDetails: {
          reviews: {
            reviewsSource: 'tmdb',
            dateOrder: 'newest-first',
            ratingOrder: 'highest-first',
            orderBy: 'date',
          },
        },
        movieDetails: {
          releases: {
            groupBy: 'country',
            dateOrder: 'oldest-first',
            countryOrder: 'a-z',
            localCountryCode: '',
          },
        },
        personDetails: {},
      },
    };
  }

  updateMovieAndSeriesDetailsOverlapPreferences(
    newMovieAndSeriesOverlapPref: MovieAndSeriesDetailsOverlapPreferences
  ) {
    this.updatePreferences((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        movieAndSeriesDetails: newMovieAndSeriesOverlapPref,
      },
    }));
  }

  updateMovieDetailsExclusivePreferences(
    newMoviePref: MovieDetailsSpecificPreferences
  ) {
    this.updatePreferences((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        movieDetails: newMoviePref,
      },
    }));
  }

  private updatePreferences(
    updater: (prev: UserPreferences) => UserPreferences
  ) {
    this._preferences.next(updater(this._preferences.value));
  }
}

export interface UserPreferences {
  theme: { colorScheme: ThemeColorScheme; accentColor: string };
  details: {
    movieAndSeriesDetails: MovieAndSeriesDetailsOverlapPreferences;
    movieDetails: MovieDetailsSpecificPreferences;
    personDetails: PersonDetailsPreferences;
  };
}

type ThemeColorScheme = 'dark' | 'light' | 'system';

export interface MovieDetailsPreferences
  extends MovieDetailsSpecificPreferences,
    MovieAndSeriesDetailsOverlapPreferences {}

export interface MovieAndSeriesDetailsOverlapPreferences {
  reviews: ReviewsPreferences;
}

export interface MovieDetailsSpecificPreferences {
  releases: MovieReleasesPreferences;
}

export interface MovieReleasesPreferences {
  groupBy?: 'release-type' | 'country';
  dateOrder?: DateOrder;
  countryOrder?: 'a-z' | 'z-a';
  localCountryCode?: string;
}

export interface ReviewsPreferences {
  reviewsSource?: 'tmdb' | 'salida';
  dateOrder?: DateOrder;
  ratingOrder?: 'highest-first' | 'lowest-first';
  orderBy?: 'date' | 'rating';
}

export interface PersonDetailsPreferences {}

type DateOrder = 'newest-first' | 'oldest-first';
