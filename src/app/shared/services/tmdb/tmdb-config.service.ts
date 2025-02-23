import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  retry,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import {
  Country,
  WatchProvider,
  WatchProviders,
} from '../../interfaces/models/tmdb/All';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TemporaryUserPreferencesService } from '../preferences/temporary-user-preferences-service';

interface CachedWatchProviders {
  movie: WatchProvider[];
  series: WatchProvider[];
}

@Injectable({
  providedIn: 'root',
})
export class TmdbConfigService {
  constructor(
    private http: HttpClient,
    private userPreferencesService: TemporaryUserPreferencesService,
  ) {}

  baseUrl = `${environment.SALIDA_API_BASE_URL}/api/v1/public/tmdb`;

  private defaultLocalCountryCode = 'PH';

  private providerBlacklist: { name: string; id: number }[] = [
    { name: 'Apple TV', id: 2 },
  ]; // Add provider names and IDs to blacklist here

  private providerWhitelist: { name: string; id: number; iconURL?: string }[] =
    [
      // { name: 'Netflix', id: 8 },
      {
        name: 'Google Play Movies',
        id: 3,
        iconURL:
          'https://image.tmdb.org/t/p/w45/8z7rC8uIDaTM91X0ZfkRf04ydj2.jpg',
      },
      {
        name: 'Apple TV+',
        id: 350,
        iconURL:
          'https://image.tmdb.org/t/p/w45/2E03IAZsX4ZaUqM7tXlctEPMGWS.jpg',
      },
      // { name: 'Amazon', id: 10 },
      // { name: 'Disney+', id: 337 },
      // { name: 'HBO Max', id: 384 },
      // { name: 'Hulu', id: 15 },
      // { name: 'Peacock', id: 386 },
      // { name: 'Paramount+', id: 531 },
      // { name: 'Crunchyroll', id: 1968 },
    ]; // Add provider names and IDs to whitelist here

  private providerOrderList: { id: number }[] = [
    { id: 8 }, // Netflix
    { id: 3 }, // Google Play Movies
    { id: 350 }, // Apple TV+
    { id: 10 }, // Amazon
    { id: 337 }, // Disney+
    { id: 384 }, // HBO Max
    { id: 15 }, // Hulu
    { id: 386 }, // Peacock
    { id: 531 }, // Paramount+
    { id: 1968 }, // Crunchyroll
  ]; // Add provider IDs here

  private providerLists = {
    sortingOrderList: this.providerOrderList,
    blacklist: this.providerBlacklist,
    whitelist: this.providerWhitelist,
  };

  private cachedCountries: Country[] = [];
  cachedWatchedProviders: CachedWatchProviders = {
    movie: [],
    series: [],
  };

  get localCountryCode(): string {
    const userPreferences = this.userPreferencesService.preferences;
    return (
      userPreferences.user.localCountryCode() || this.defaultLocalCountryCode
    );
  }

  getCountryCodes(): Observable<Country[]> {
    if (this.cachedCountries.length) {
      return of(this.cachedCountries);
    } else {
      return this.http
        .get<Country[]>(`${this.baseUrl}/configuration/countries`)
        .pipe(
          retry(2),
          shareReplay(1),
          tap((countries: Country[]) => {
            this.cachedCountries = countries;
          }),
          catchError((error) => {
            console.error('Error fetching country codes:', error);
            return of([]);
          }),
        );
    }
  }

  getCountryNameFromCode(code: string): string | undefined {
    return this.cachedCountries.find((country) => country.iso_3166_1 === code)
      ?.native_name;
  }

  getProviderIconURL(
    providerId: number,
    type: 'movie' | 'series' = 'movie',
  ): string | null {
    if (!this.cachedWatchedProviders || !this.cachedWatchedProviders[type]) {
      console.warn(`Watch providers for ${type} not yet loaded!`);
      return null;
    }

    const provider = this.cachedWatchedProviders[type].find(
      (provider) => provider.provider_id === providerId,
    );

    if (provider?.logo_path) {
      return `https://image.tmdb.org/t/p/w45${provider.logo_path}`;
    } else {
      // Fallback to whitelist icon if available
      const whitelistProvider = this.providerWhitelist.find(
        (wp) => wp.id === providerId,
      );
      return whitelistProvider?.iconURL || null;
    }
  }

  getWatchProviders(): Observable<CachedWatchProviders> {
    const providersCountLimit = 20;

    const fetchProviders = (
      type: 'movie' | 'tv',
    ): Observable<WatchProvider[]> => {
      return this.http
        .get<WatchProviders>(
          `${this.baseUrl}/watch/providers/${type}?language=en-US&watch_region=${this.localCountryCode}`,
        )
        .pipe(
          retry(3),
          take(1),
          map((res: WatchProviders) => {
            const blacklistIds = this.providerLists.blacklist.map(
              (provider) => provider.id,
            );
            const whitelistIds = this.providerLists.whitelist.map(
              (provider) => provider.id,
            );

            let providers = res.results
              .filter(
                (provider) => !blacklistIds.includes(provider.provider_id),
              )
              .map((provider) => {
                const whitelistProvider = this.providerLists.whitelist.find(
                  (wp) => wp.id === provider.provider_id,
                );
                if (whitelistProvider) {
                  provider.provider_name = whitelistProvider.name;
                }
                return provider;
              })
              .filter(
                (provider) => provider.display_priority <= providersCountLimit,
              );

            const whitelistedProviders = this.providerLists.whitelist.map(
              (provider) => ({
                provider_id: provider.id,
                provider_name: provider.name,
                display_priority: 0, // Default display priority for whitelisted providers
                logo_path: '', // Add appropriate logo path if available
                display_priorities: {},
              }),
            );

            const providerMap = new Map<number, WatchProvider>();
            providers.forEach((provider) => {
              providerMap.set(provider.provider_id, provider);
            });
            whitelistedProviders.forEach((provider) => {
              providerMap.set(provider.provider_id, provider);
            });

            providers = Array.from(providerMap.values());

            const orderMap = new Map<number, number>(
              this.providerLists.sortingOrderList.map((item, index) => [
                item.id,
                index,
              ]),
            );

            const orderedProviders = providers.filter((provider) =>
              orderMap.has(provider.provider_id),
            );
            const unorderedProviders = providers.filter(
              (provider) => !orderMap.has(provider.provider_id),
            );

            orderedProviders.sort((a, b) => {
              const orderA = orderMap.get(a.provider_id);
              const orderB = orderMap.get(b.provider_id);
              return (orderA ?? 0) - (orderB ?? 0);
            });

            unorderedProviders.sort(
              (a, b) => a.display_priority - b.display_priority,
            );

            return [...orderedProviders, ...unorderedProviders];
          }),
          catchError((err) => {
            console.log(`failed to fetch ${type} watch providers`, err);
            return of([]);
          }),
        );
    };

    if (
      !this.cachedWatchedProviders.movie.length ||
      !this.cachedWatchedProviders.series.length
    ) {
      return forkJoin({
        movie: fetchProviders('movie'),
        series: fetchProviders('tv'),
      }).pipe(
        tap(({ movie, series }) => {
          this.cachedWatchedProviders.movie = movie;
          this.cachedWatchedProviders.series = series;
        }),
        map(() => this.cachedWatchedProviders),
        catchError((error) => {
          console.error('Error fetching watch providers:', error);
          return of(this.cachedWatchedProviders);
        }),
      );
    } else {
      return of(this.cachedWatchedProviders);
    }
  }
}
