import { Injectable } from '@angular/core';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { Country } from '../../interfaces/tmdb/All';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbConfigService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.TMDB_API_BASE_URL;

  localCountryCode = 'PH';
  private cachedCountries: Country[] = [];

  getCountryCodes(): Observable<Country[]> {
    const countryCodes = this.cachedCountries;

    if (countryCodes[0]) {
      return of(countryCodes);
    } else {
      return this.http
        .get<Country[]>(`${this.baseUrl}/configuration/countries`)
        .pipe(
          retry(2),
          shareReplay(1),
          tap((countries: Country[]) => {
            this.cachedCountries = countries;
          })
        );
    }
  }
}
