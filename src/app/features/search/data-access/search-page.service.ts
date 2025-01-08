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
import { MovieSummary } from '../../../shared/interfaces/models/tmdb/Movies';
import { SeriesSummary } from '../../../shared/interfaces/models/tmdb/Series';
import { PersonSummary } from '../../../shared/interfaces/models/tmdb/All';

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

  private previousQuery = signal('this-is-a-filler-string');
  private previousSearchType: WritableSignal<SearchType | ''> = signal('');

  triggerSearch(searchQuery: string) {
    if (
      searchQuery === ''
      //  ||
      // (this.previousQuery() === this.searchPreferences.all.query() &&
      //   this.searchPreferences.searchType() === this.previousSearchType())
    ) {
      this.resetResultsAndQuery();
      return;
    }

    // this.previousSearchType.set(this.searchPreferences.searchType());
    this.previousQuery.set(this.searchPreferences.all.query());
    this.searchPreferences.all.query.set(searchQuery);

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

  resetResultsAndQuery() {
    this.searchPreferences.all.query.set('');

    this.movieSearchResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.seriesSearchResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.allSearchResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.peopleSearchResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  searchAll() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      page: signal(
        this.allSearchResults.page ? this.allSearchResults.page + 1 : 1,
      ),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchAll(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        this.allSearchResults = {
          ...this.allSearchResults,
          results: [
            ...this.allSearchResults.results,
            ...apiResults.results.map((entity) =>
              this.transformAny(
                entity as MovieSummary | SeriesSummary | PersonSummary,
              ),
            ),
          ],
          page: apiResults.page,
          total_pages: apiResults.total_pages,
          total_results: apiResults.total_results,
        };
      });
  }

  searchMovies() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      ...this.searchPreferences.movie,
      page: signal(
        this.movieSearchResults.page ? this.movieSearchResults.page + 1 : 1,
      ),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchMovies(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((movie) => this.transformMovie(movie));

        this.movieSearchResults = {
          ...apiResults,
          results: [...this.movieSearchResults.results, ...transformedResults],
        };
      });
  }

  searchSeries() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      ...this.searchPreferences.series,
      page: signal(
        this.seriesSearchResults.page ? this.seriesSearchResults.page + 1 : 1,
      ),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchSeries(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((series) => this.transformSeries(series));

        this.seriesSearchResults = {
          ...apiResults,
          results: [...this.seriesSearchResults.results, ...transformedResults],
        };
      });
  }

  searchPeople() {
    const preferences = this.convertSignalsToValue({
      ...this.searchPreferences.all,
      page: signal(
        this.peopleSearchResults.page ? this.peopleSearchResults.page + 1 : 1,
      ),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchPerson(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: PersonResultCardProps[] =
          apiResults.results.map((person) => this.transformPerson(person));

        this.peopleSearchResults = {
          ...apiResults,
          results: [...this.peopleSearchResults.results, ...transformedResults],
        };
      });
  }

  transformMovie(movie: MovieSummary): MediaResultCardProps {
    return {
      id: movie.id,
      onClick: () => {
        this.movieDetailsService.viewMovieDetails(movie.id, movie.title);
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
    };
  }

  transformSeries(series: SeriesSummary): MediaResultCardProps {
    return {
      id: series.id,
      type: 'series',
      onClick: () => {
        this.seriesDetailsService.viewSeriesDetails(series.id, series.name);
      },
      title: series.name,
      original_title:
        series.original_name &&
        series.original_name.toLowerCase() !== series.name.toLocaleLowerCase()
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
    };
  }

  transformPerson(person: PersonSummary): PersonResultCardProps {
    return {
      type: 'person',
      id: person.id,
      name: person.name,
      originalName:
        person.original_name &&
        person.original_name.toLowerCase() !== person.name.toLocaleLowerCase()
          ? `(${person.original_name})`
          : null,
      profilePhotoURL: person.profile_path || null,
      role: KnownForDepartmentLabelEnum[
        person['known_for_department'] as KnownForDepartmentKey
      ],
      onClick: () => {
        console.log('View person page not available yet - search result card');
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
    };
  }

  transformAny(
    entity: MovieSummary | SeriesSummary | PersonSummary,
  ): MediaResultCardProps | PersonResultCardProps {
    const type = this.getEntityType(entity);

    switch (type) {
      case 'movie':
        return this.transformMovie(entity as MovieSummary);
      case 'person':
        return this.transformPerson(entity as PersonSummary);
      default:
        return this.transformSeries(entity as SeriesSummary);
    }
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

  isMediaResultCardProps(
    props: MediaResultCardProps | PersonResultCardProps,
  ): props is MediaResultCardProps {
    return (
      this.getEntityType(props) === 'movie' ||
      this.getEntityType(props) === 'series'
    );
  }

  getEntityType(entity: any): 'movie' | 'series' | 'person' {
    return (
      entity.media_type || (entity.type === 'person' ? 'person' : 'series')
    );
  }

  isNoFirstPageResultsYet(type: SearchType) {
    switch (type) {
      case 'all':
        return this.allSearchResults.page === 0;
      case 'movie':
        return this.movieSearchResults.page === 0;
      case 'person':
        return this.peopleSearchResults.page === 0;
      case 'series':
        return this.seriesSearchResults.page === 0;
    }
  }

  searchPreferences = {
    searchType: signal('all') as WritableSignal<SearchType>,
    all: {
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

    person: { query: signal(''), previousQuery: signal('') },
  };

  getSearchTypeIndexInPillTabs(tab: SearchType): number {
    const tabs: SearchType[] = ['all', 'movie', 'series', 'person'];
    return tabs.indexOf(tab);
  }

  allSearchResults: {
    page: number;
    results: (MediaResultCardProps | PersonResultCardProps)[];
    total_pages: number;
    total_results: number;
  } = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  movieSearchResults: {
    page: number;
    results: MediaResultCardProps[];
    total_pages: number;
    total_results: number;
  } = {
    page: 0,
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
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  peopleSearchResults: {
    page: number;
    results: PersonResultCardProps[];
    total_pages: number;
    total_results: number;
  } = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  };
}
