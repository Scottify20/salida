import { Injectable } from '@angular/core';
import { TmdbConfigService } from './tmdb-config.service';
import { Person, TrendingPeople } from '../../interfaces/models/tmdb/People';
import {
  Observable,
  of,
  retry,
  shareReplay,
  tap,
  catchError,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TmdbTimeWindow } from '../../interfaces/models/tmdb/All';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(
    private tmdbConfig: TmdbConfigService,
    private http: HttpClient,
  ) {}
  private cachedPerson: { [key: string]: Observable<Person> } = {};
  private cachedTrendingPeople: { [key: string]: Observable<TrendingPeople> } =
    {};

  getPersonDetails(personId: number): Observable<Person> {
    const personIdString = personId.toString();

    if (!this.cachedPerson[personIdString]) {
      this.cachedPerson[personIdString] = this.http
        .get<Person>(
          `${this.tmdbConfig.baseUrl}/person/${personIdString}?append_to_response=external_ids,images,latest,movie_credits,tv_credits`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((person: Person) => {
            // Store the fetched person data in the cache.
            this.cachedPerson[personIdString] = of(person);
          }),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch person details'),
          ),
        );
    }

    return this.cachedPerson[personIdString];
  }

  getTrendingPeople(timeWindow: TmdbTimeWindow): Observable<TrendingPeople> {
    const cacheKey = `trending-${timeWindow}`;
    if (!this.cachedTrendingPeople[cacheKey]) {
      this.cachedTrendingPeople[cacheKey] = this.http
        .get<TrendingPeople>(
          `${this.tmdbConfig.baseUrl}/trending/person/${timeWindow}`,
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((result: TrendingPeople) => {
            // Store the fetched trending people data in the cache.
            this.cachedTrendingPeople[cacheKey] = of(result);
          }),
          catchError((err) =>
            this.handleError(err, 'Failed to fetch trending people'),
          ),
        );
    }
    return this.cachedTrendingPeople[cacheKey];
  }

  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => error); // Re-throw for global error handling
  }
}
