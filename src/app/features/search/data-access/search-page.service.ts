import {
  DestroyRef,
  effect,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
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
  ) {
    effect(() => {
      // this effect listens for changes in the searchParams
      // then resets the results for all content type
      const p = this.searchParams;
      const valuesToWatch: (string | number | boolean)[] = [
        p.all.query(),
        p.all.language(),
        p.all.includeAdult(),
        p.movie.year(),
        p.movie.primaryReleaseYear(),
        p.series.year(),
        p.series.firstAirDateYear(),
      ];

      this.resetResults();

      return valuesToWatch;
    });
  }

  searchParams = {
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

    person: {},
  };

  triggerSearch(searchQuery: string) {
    if (searchQuery === 'cleared-search-bar') {
      // sets the query signal to '' which also triggers the reset caused by the effect in the constructor
      this.searchParams.all.query.set('');
      return;
    }

    this.searchParams.all.query.set(searchQuery);

    switch (this.searchParams.searchType()) {
      case 'all':
        this.isMaxPageReached('all') ? null : this.searchAll();
        break;
      case 'movie':
        this.isMaxPageReached('movie') ? null : this.searchMovies();
        break;
      case 'series':
        this.isMaxPageReached('series') ? null : this.searchSeries();
        break;
      case 'person':
        this.isMaxPageReached('person') ? null : this.searchPeople();
    }
  }

  searchAll() {
    const preferences = this.convertSignalsToValue({
      ...this.searchParams.all,
      page: signal(this.allResults.page ? this.allResults.page + 1 : 1),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchAll(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const uniqueIds: string[] = [];

        this.allResults = {
          ...this.allResults,
          results: [
            ...this.allResults.results,
            ...apiResults.results.map((entity) =>
              this.transformAny(
                entity as MovieSummary | SeriesSummary | PersonSummary,
              ),
            ),
          ].filter((entity) => {
            if (uniqueIds.indexOf(entity.id) < 0) {
              // if id does not exist yet include it then push its id
              uniqueIds.push(entity.id);
              return true;
            }

            // if id already exists yet include it
            return false;
          }),
          page: apiResults.page,
          total_pages: apiResults.total_pages,
          total_results: apiResults.total_results,
        };
      });
  }

  searchMovies() {
    const preferences = this.convertSignalsToValue({
      ...this.searchParams.all,
      ...this.searchParams.movie,
      page: signal(this.movieResults.page ? this.movieResults.page + 1 : 1),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchMovies(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((movie) => this.transformMovie(movie));

        this.movieResults = {
          ...apiResults,
          results: [...this.movieResults.results, ...transformedResults],
        };
      });
  }

  searchSeries() {
    const preferences = this.convertSignalsToValue({
      ...this.searchParams.all,
      ...this.searchParams.series,
      page: signal(this.seriesResults.page ? this.seriesResults.page + 1 : 1),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchSeries(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: MediaResultCardProps[] =
          apiResults.results.map((series) => this.transformSeries(series));

        this.seriesResults = {
          ...apiResults,
          results: [...this.seriesResults.results, ...transformedResults],
        };
      });
  }

  searchPeople() {
    const preferences = this.convertSignalsToValue({
      ...this.searchParams.all,
      page: signal(this.peopleResults.page ? this.peopleResults.page + 1 : 1),
    }) as SearchParams;

    this.searchAndDiscoverService
      .searchPerson(preferences)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiResults) => {
        const transformedResults: PersonResultCardProps[] =
          apiResults.results.map((person) => this.transformPerson(person));

        this.peopleResults = {
          ...apiResults,
          results: [...this.peopleResults.results, ...transformedResults],
        };
      });
  }

  transformMovie(movie: MovieSummary): MediaResultCardProps {
    return {
      id: 'm-' + movie.id,
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
      genres: movie.genre_ids.map((id) => id.toString()),
      overview: movie.overview,
    };
  }

  transformSeries(series: SeriesSummary): MediaResultCardProps {
    return {
      id: 's-' + series.id,
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
      id: 'p-' + person.id,
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
      knownForMedia: person.known_for
        ? person.known_for.map((media) => ({
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
          }))
        : [],
    };
  }

  transformAny(
    entity: MovieSummary | SeriesSummary | PersonSummary,
  ): MediaResultCardProps | PersonResultCardProps {
    const type = this.getEntityType(entity);

    let transformedEntity!: MediaResultCardProps | PersonResultCardProps;

    switch (type) {
      case 'movie':
        transformedEntity = this.transformMovie(entity as MovieSummary);
        transformedEntity.metadata.unshift('Movie');
        break;
      case 'series':
        transformedEntity = this.transformSeries(entity as SeriesSummary);
        transformedEntity.metadata.unshift('TV Show');
        break;
      default:
        transformedEntity = this.transformPerson(entity as PersonSummary);
    }

    return transformedEntity;
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
        return this.allResults.page === 0;
      case 'movie':
        return this.movieResults.page === 0;
      case 'person':
        return this.peopleResults.page === 0;
      case 'series':
        return this.seriesResults.page === 0;
    }
  }

  getSearchTypeIndexInPillTabs(tab: SearchType): number {
    const tabs: SearchType[] = ['all', 'movie', 'series', 'person'];
    return tabs.indexOf(tab);
  }

  allResults: {
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

  movieResults: {
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

  seriesResults: {
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

  peopleResults: {
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

  isMaxPageReached(type: SearchType): boolean {
    switch (type) {
      case 'all':
        return (
          (this.allResults.total_pages === this.allResults.page &&
            this.allResults.page !== 0) ||
          this.allResults.page === 10
        );
      case 'movie':
        return (
          (this.movieResults.total_pages === this.movieResults.page &&
            this.movieResults.page !== 0) ||
          this.movieResults.page === 10
        );
      case 'series':
        return (
          (this.seriesResults.total_pages === this.seriesResults.page &&
            this.seriesResults.page !== 0) ||
          this.seriesResults.page === 10
        );
      case 'person':
        return (
          (this.peopleResults.total_pages === this.peopleResults.page &&
            this.peopleResults.page !== 0) ||
          this.peopleResults.page === 10
        );
    }
  }

  private resetResults() {
    this.movieResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.seriesResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.allResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    this.peopleResults = {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}
