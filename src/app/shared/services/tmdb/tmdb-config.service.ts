import { Injectable } from '@angular/core';
import { Observable, of, retry, shareReplay, tap } from 'rxjs';
import { Country } from '../../interfaces/tmdb/All';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TmdbConfigService {
  constructor(private http: HttpClient) {}

  // baseUrl = 'https://omdb-titles-browser-api-proxy.vercel.app/api/tmdb';
  //baseUrl = 'http://192.168.245.116:8000/api/tmdb'; // Data
  // baseUrl = 'http://192.168.100.238:8000/api/tmdb'; // hotspot pc
  // baseUrl = 'http://192.168.245.32/api/tmdb'; // hotspot laptop
  baseUrl = 'http://192.168.100.10:8000/api/tmdb'; // laptop

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
