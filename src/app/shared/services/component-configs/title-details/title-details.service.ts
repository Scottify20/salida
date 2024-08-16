import { ElementRef, Injectable, Renderer2, ViewChild } from '@angular/core';
import { ReleasesConfig } from '../../../components/title-details/releases/releases.component';

@Injectable({
  providedIn: 'root',
})
export class TitleDetailsService {
  config: TitleDetailsConfig = {
    hero: {},
    'more-details': {},
    reviews: {
      reviewsSource: 'tmdb',
    },
    releases: {
      groupBy: 'release-type',
      dateOrder: 'oldest-first',
      countryOrder: 'a-z',
      localCountryCode: '',
    },
    certifications: {},
    seasons: {},
  };
}

interface TitleDetailsConfig {
  hero: {};
  'more-details': {};
  reviews: ReviewsConfig;
  releases: ReleasesConfig;
  certifications: {};
  seasons: {};
}

export interface ReviewsConfig {
  reviewsSource: 'tmdb' | 'salida';
}
