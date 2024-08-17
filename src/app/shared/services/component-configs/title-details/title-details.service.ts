import { ElementRef, Injectable, Renderer2, ViewChild } from '@angular/core';
import { ReleasesConfig } from '../../../components/title-details/releases/releases.component';
import { ReviewsConfig } from '../../../components/title-details/reviews/reviews.component';
import { SeasonsConfig } from '../../../components/title-details/seasons/seasons.component';

@Injectable({
  providedIn: 'root',
})
export class TitleDetailsService {
  config: TitleDetailsConfig = {
    hero: {},
    'more-details': {},
    reviews: {
      reviewsSource: 'tmdb',
      order: 'oldest-first',
    },
    releases: {
      groupBy: 'release-type',
      dateOrder: 'oldest-first',
      countryOrder: 'a-z',
      localCountryCode: '',
    },
    certifications: {},
    seasons: {
      selectedSeason: '',
      seasons: [],
    },
  };
}
interface TitleDetailsConfig {
  hero: {};
  'more-details': {};
  reviews: ReviewsConfig;
  releases: ReleasesConfig;
  certifications: {};
  seasons: SeasonsConfig;
}
