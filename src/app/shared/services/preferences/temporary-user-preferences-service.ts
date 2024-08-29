import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemporaryUserPreferencesService {
  private _preferences = new BehaviorSubject<Preferences>(
    this.defaultPreferences
  );

  preferences$: Observable<Preferences> = this._preferences.asObservable();

  private get defaultPreferences(): Preferences {
    return {
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

  private updatePreferences(updater: (prev: Preferences) => Preferences) {
    this._preferences.next(updater(this._preferences.value));
  }
}

export interface Preferences {
  details: {
    movieAndSeriesDetails: MovieAndSeriesDetailsOverlapPreferences;
    movieDetails: MovieDetailsSpecificPreferences;
    personDetails: PersonDetailsPreferences;
  };
}

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
