import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { WindowResizeService } from '../../../shared/services/dom/window-resize.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../../shared/services/dom/platform-check.service';
import {
  MediaSummary,
  TrendingTitles,
} from '../../../shared/interfaces/models/tmdb/All';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent {
  @Input() cardIndex = 0;
  @Input() titleDetails: MediaSummary = {
    media_type: 'movie',
    backdrop_path: null,
    id: 0,
    overview: '',
    poster_path: null,
    adult: false,
    original_language: '',
    genre_ids: [],
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
  };

  constructor(private platformCheck: PlatformCheckService) {}

  protected cardOpacity = 'opacity: 0%';

  ngOnInit() {
    this.setOpacityOfCardDetailsOnLoad();
  }

  setOpacityOfCardDetailsOnLoad() {
    if (this.platformCheck.isServer()) {
      return;
    }

    // Consider using CSS transitions or animations for a smoother fade-in effect
    setTimeout(() => {
      this.cardOpacity = 'opacity: 100%';
    }, 0);
  }

  runCallbackOnClick(callback?: () => void) {
    if (callback) {
      callback();
    }
  }

  getImageSrcBasedOnWidth(): string {
    if (this.platformCheck.isServer()) {
      return '';
    }

    const baseLink = 'https://image.tmdb.org/t/p/'; // Use HTTPS
    const poster_path = this.titleDetails.poster_path || '';
    const windowWidth = window.innerWidth;

    if (windowWidth === 0) {
      return '';
    }
    if (windowWidth <= 320) {
      return baseLink + 'w300' + poster_path;
    }
    if (windowWidth <= 480) {
      return baseLink + 'w500' + poster_path;
    }
    if (windowWidth <= 720) {
      return baseLink + 'w780' + this.titleDetails.backdrop_path;
    } else {
      return baseLink + 'w1280' + this.titleDetails.backdrop_path;
    }
  }
}
