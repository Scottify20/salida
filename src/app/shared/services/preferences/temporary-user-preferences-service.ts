import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemporaryUserPreferencesService {
  preferences: UserPreferences = { ...this.defaultPreferences };

  private get defaultPreferences(): UserPreferences {
    return {
      user: {
        localCountryCode: signal(''),
        showAdultContent: signal(false),
      },
      theme: {
        colorScheme: signal('dark'),
        accentColor: signal('#FFFFFF'),
      },
      details: {
        movieAndSeriesDetails: {
          reviews: {
            reviewsSource: signal('tmdb'),
            dateOrder: signal('latest-first'),
            ratingOrder: signal('highest-first'),
            orderBy: signal('date'),
          },
          castOrCrew: signal('cast'),
        },
        movieDetails: {
          releases: {
            groupBy: signal('release-type'),
            dateOrder: signal('earliest-first'),
            countryOrder: signal('a-z'),
            showLocalCountryFirst: signal(true),
          },
        },
        personDetails: {},
      },
    };
  }
}

export interface UserPreferences {
  details: {
    movieAndSeriesDetails: MovieAndSeriesDetailsOverlapPreferences;
    movieDetails: MovieDetailsSpecificPreferences;
    personDetails: PersonDetailsPreferences;
  };
  theme: { colorScheme: ThemeColorScheme; accentColor: WritableSignal<string> };
  user: {
    showAdultContent: WritableSignal<boolean>;
    localCountryCode: WritableSignal<string>;
  };
}

type ThemeColorScheme = WritableSignal<'dark' | 'light' | 'system'>;

export interface MovieDetailsPreferences
  extends MovieDetailsSpecificPreferences,
    MovieAndSeriesDetailsOverlapPreferences {}

export interface MovieAndSeriesDetailsOverlapPreferences {
  castOrCrew: WritableSignal<'cast' | 'crew'>;
  reviews: ReviewsPreferences;
}

export interface MovieDetailsSpecificPreferences {
  releases: MovieReleasesPreferences;
}

export interface MovieReleasesPreferences {
  groupBy: WritableSignal<'release-type' | 'country'>;
  dateOrder: DateOrder;
  countryOrder: WritableSignal<'a-z' | 'z-a'>;
  showLocalCountryFirst: WritableSignal<boolean>;
}

export interface ReviewsPreferences {
  reviewsSource: ReviewsSource;
  dateOrder: DateOrder;
  ratingOrder: WritableSignal<'highest-first' | 'lowest-first'>;
  orderBy: WritableSignal<'date' | 'rating'>;
}

export interface PersonDetailsPreferences {}

type DateOrder = WritableSignal<'latest-first' | 'earliest-first'>;
export type ReviewsSource = WritableSignal<'tmdb' | 'salida'>;
