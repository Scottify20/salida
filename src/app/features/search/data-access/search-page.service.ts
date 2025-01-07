import { DestroyRef, Injectable, signal, WritableSignal } from '@angular/core';
import {
  SearchAndDiscoverService,
  SearchParams,
} from '../../../shared/services/tmdb/search-and-discover.service';
import { SeriesDetailsService } from '../../details/series-details/data-access/series-details.service';
import { MovieDetailsService } from '../../details/movie-details/data-access/movie-details.service';
import { MediaResultCardProps } from '../ui/media-result-card/media-result-card.component';
import { TemporaryUserPreferencesService } from '../../../shared/services/preferences/temporary-user-preferences-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonResultCardProps } from '../ui/person-result-card/person-result-card.component';
import {
  KnownForDepartmentKey,
  KnownForDepartmentLabelEnum,
} from '../../../shared/interfaces/models/tmdb/People';

export type SearchType = 'all' | 'movie' | 'series' | 'person';

export interface ResultCardProps {
  id: number;
  type: SearchType;
  title: string | undefined;
  photoURL: string | null;
  subtitle: string | undefined;
  metadata: (string | null)[];
  genres?: string[];
  overview?: string;
  media?: { title: string; posterURL: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchPageService {
  constructor(
    private searchAndDiscoverService: SearchAndDiscoverService,
    private destroyRef: DestroyRef,
    private seriesDetailsService: SeriesDetailsService,
    private movieDetailsService: MovieDetailsService,
    private preferencesService: TemporaryUserPreferencesService,
  ) {}

  searchPreferences = {
    searchType: signal('person') as WritableSignal<SearchType>,
    all: {
      page: signal(1),
      query: signal(''),
      language: signal('en-US'),
      includeAdult: this.preferencesService.preferences.user.showAdultContent,
    },

    movie: {
      year: signal(''),
      primaryReleaseYear: signal(''),
    },

    series: {
      year: signal(''),
      firstAirDateYear: signal(''),
    },

    person: {},
  };

  movieSearchResults: {
    page: number;
    results: MediaResultCardProps[];
    total_pages: number;
    total_results: number;
  } = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  seriesSearchResults: {
    page: number;
    results: MediaResultCardProps[];
    total_pages: number;
    total_results: number;
  } = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  personSearchResults: {
    page: number;
    results: PersonResultCardProps[];
    total_pages: number;
    total_results: number;
  } = {
    page: 1,
    results: [
      {
        type: 'person',
        id: 6968,
        role: 'Actor',
        name: 'Hugh Jackman',
        originalName: 'w wfew wef weffjwfjweJJ',
        profilePhotoURL:
          'https://image.tmdb.org/t/p/w185/4Xujtewxqt6aU0Y81tsS9gkjizk.jpg',
        knownForMedia: [
          {
            id: 6968,
            backdropURL:
              'https://image.tmdb.org/t/p/w185/9X7YweCJw3q8Mcf6GadxReFEksM.jpg',
            title: 'Logan',
            type: 'movie',
            onClick: () => {
              this.movieDetailsService.viewMovieDetails(6968, 'Logan');
            },
          },
          {
            id: 1124,
            backdropURL:
              'https://image.tmdb.org/t/p/w185/yCnJT53HMXAK87xzPAdjdYhZ3JE.jpg',
            title: 'The Prestige',
            type: 'movie',
            onClick: () => {
              this.movieDetailsService.viewMovieDetails(1123, 'The Prestige');
            },
          },
          {
            id: 127585,
            backdropURL:
              'https://image.tmdb.org/t/p/w185/hUPgIibqZlwbhs4N08cPzzc4f5K.jpg',
            title:
              'X-Men: Days of Future Past r43r34t rtgtrrthrth rth54h54h45h54h54h',
            type: 'movie',
            onClick: () => {
              this.movieDetailsService.viewMovieDetails(
                127585,
                'X-Men: Days of Future Past',
              );
            },
          },
        ],
        onClick: () => {},
      },
    ],
    total_pages: 0,
    total_results: 0,
  };

  triggerSearch(searchQuery: string) {
    this.searchPreferences.all.query.set(searchQuery);

    this.movieSearchResults.results = [];

    switch (this.searchPreferences.searchType()) {
      case 'all':
        this.searchAll();
        break;
      case 'movie':
        this.searchMovies();
        break;
      case 'series':
        this.searchSeries();
        break;
      case 'person':
        this.searchPeople();
    }
  }

  searchAll() {
    const preferences = this.convertSignalsToValue(
      this.searchPreferences.all,
    ) as SearchParams;

    this.searchAndDiscoverService
      .searchAll(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((results) => {
        // this.searchResults = results;
      });
  }

  searchMovies() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      ...this.searchPreferences.movie,
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchMovies(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((movie) => ({
            id: movie.id,
            onClick: () => {
              this.movieDetailsService.viewMovieDetails(movie.id, movie.name);
            },
            type: 'movie',
            title: movie.title,
            original_title:
              movie.original_title &&
              movie.original_title.toLowerCase() !==
                (movie.title || '').toLocaleLowerCase()
                ? `(${movie.original_title})`
                : undefined,
            posterURL: movie.poster_path,
            metadata: [
              movie.release_date?.substring(0, 4) || null,
              movie.vote_average
                ? (movie.vote_average * 10).toFixed().toString() + '%'
                : null,
            ],
            genres: movie.genre_ids.slice(0, 3).map((id) => id.toString()),
            overview: movie.overview,
          }));

        this.movieSearchResults = {
          ...apiResults,
          results: transformedResults,
        };
      });
  }

  searchSeries() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      ...this.searchPreferences.series,
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchSeries(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((series) => ({
            id: series.id,
            type: 'series',
            onClick: () => {
              this.seriesDetailsService.viewSeriesDetails(
                series.id,
                series.name,
              );
            },
            title: series.name,
            original_title:
              series.original_name &&
              series.original_name.toLowerCase() !==
                series.name.toLocaleLowerCase()
                ? `(${series.original_name})`
                : undefined,
            posterURL: series.poster_path,
            metadata: [
              series['first_air_date'].substring(0, 4),
              series.vote_average
                ? (series.vote_average * 10).toFixed().toString() + '%'
                : null,
            ],
            genres: series.genre_ids.slice(0, 3).map((id) => id.toString()),
            overview: series.overview,
          }));

        this.seriesSearchResults = {
          ...apiResults,
          results: transformedResults,
        };
      });
  }

  searchPeople() {
    const preferences = this.convertSignalsToValue(
      this.searchPreferences.all,
    ) as SearchParams;

    this.searchAndDiscoverService
      .searchPerson(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: PersonResultCardProps[] =
          apiResults.results.map((person) => ({
            type: 'person',
            id: person.id,
            name: person.name,
            originalName:
              person.original_name &&
              person.original_name.toLowerCase() !==
                person.name.toLocaleLowerCase()
                ? `(${person.original_name})`
                : null,
            profilePhotoURL: person.profile_path,
            role: KnownForDepartmentLabelEnum[
              person['known_for_department'] as KnownForDepartmentKey
            ],
            onClick: () => {
              console.log(
                'View series page not available yet - search result card',
              );
            },
            knownForMedia: person.known_for.slice(0, 3).map((media) => ({
              id: media.id,
              type: media.media_type as 'movie' | 'tv',
              title: media.name || media.title || null,
              backdropURL: media.backdrop_path,
              onClick:
                media.media_type === 'movie'
                  ? () => {
                      this.movieDetailsService.viewMovieDetails(
                        media.id,
                        media.title || '',
                      );
                    }
                  : () => {
                      this.seriesDetailsService.viewSeriesDetails(
                        media.id,
                        media.title || '',
                      );
                    },
            })),
          }));

        this.personSearchResults = {
          ...apiResults,
          results: transformedResults,
        };
      });
  }

  convertSignalsToValue(object: {
    [key: string]: WritableSignal<any>;
  }): SearchParams {
    const result: { [key: string]: any } = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        result[key] = object[key]();
      }
    }
    return result as SearchParams;
  }
}
