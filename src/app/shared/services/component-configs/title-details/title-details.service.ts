import { ElementRef, Injectable, Renderer2, ViewChild } from '@angular/core';
import { ReleasesConfig } from '../../../components/title-details/releases/releases.component';
import { ReviewsConfig } from '../../../components/title-details/reviews/reviews.component';
import { SeasonsConfig } from '../../../components/title-details/seasons/seasons.component';
import { BehaviorSubject } from 'rxjs';

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
      selectedSeason: 'Season 1',
      seasons: [],
      pickerShown: false,
    },
  };

  // private _configSubject = new BehaviorSubject<TitleDetailsConfig>(this.config);

  // get configObservable$() {
  //   return this._configSubject.asObservable();
  // }

  // toggleSeasonPicker() {
  //   const seasonConfig = { ...this._configSubject.value.seasons };
  //   seasonConfig.pickerShown = !seasonConfig.pickerShown;
  //   const updateData = { ...this._configSubject.value, seasons: seasonConfig };
  //   this._configSubject.next(updateData);
  // }
}
interface TitleDetailsConfig {
  hero: {};
  'more-details': {};
  reviews: ReviewsConfig;
  releases: ReleasesConfig;
  certifications: {};
  seasons: SeasonsConfig;
}
