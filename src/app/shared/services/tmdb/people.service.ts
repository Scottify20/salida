import { Injectable } from '@angular/core';
import { TmdbConfigService } from './tmdb-config.service';
import { Person, TrendingPeople } from '../../interfaces/tmdb/People';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TmdbTimeWindow } from '../../interfaces/tmdb/All';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(
    private tmdbConfig: TmdbConfigService,
    private http: HttpClient
  ) {}
  private cachedPerson: { [key: string]: Observable<Person> } = {};
  private cachedTrendingPeople!: Observable<TrendingPeople>;

  getPersonDetails(personId: number): Observable<Person> {
    const personIdString = personId.toString();

    if (!this.cachedPerson[personIdString]) {
      this.http
        .get<Person>(
          `${this.tmdbConfig.baseUrl}/person/${personIdString}?append_to_response=external_ids,images,latest,movie_credits,tv_credits`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((person: Person) => {
            // Store the fetched person data in the cache.
            this.cachedPerson[personIdString] = of(person);
          })
        );
    }

    return this.cachedPerson[personIdString];
  }

  getTrendingPeople(timeWindow: TmdbTimeWindow): Observable<TrendingPeople> {
    if (!this.cachedTrendingPeople) {
      this.cachedTrendingPeople = this.http
        .get<TrendingPeople>(
          `${this.tmdbConfig.baseUrl}/trending/person/${timeWindow}`
        )
        .pipe(
          retry(2),
          shareReplay(1),
          tap((result: TrendingPeople) => {
            // Store the fetched trending series data in the cache.
            this.cachedTrendingPeople = of(result);
          })
        );
    }
    return this.cachedTrendingPeople;
  }
}
