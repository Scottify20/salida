import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { TmdbTitle } from '../hero-cards/hero-cards.component';
import {
  WindowResizeDimensionService,
  WindowResizeServiceUser,
} from '../../shared/services/window-resize.service';
import { Subscription } from 'rxjs';
import { NgIf, DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../shared/services/platform-check.service';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent
  implements OnInit, OnDestroy, WindowResizeServiceUser
{
  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;

  @Input() cardIndex = 0;
  @Input() titleDetails: TmdbTitle = {
    title: '',
    id: 0,
    posterPath: '',
    backdropPath: '',
    plot: '',
    genres: [],
    logoPath: '',
  };

  constructor(
    private windowResizeService: WindowResizeDimensionService,
    private platformCheck: PlatformCheckService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.setOpacityOfCardDetailsOnLoad();
    this.windowDimensions = { width: 0, height: 0 };

    this._resizeSubscription =
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this._isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });

    // Ensure the initial values are set
    this.windowResizeService.isResizing();
  }

  protected cardOpacity = 'opacity: 0%';

  setOpacityOfCardDetailsOnLoad() {
    if (this.platformCheck.isServer()) {
      return;
    }

    const cardDetails = this.document.getElementById(
      'hero-card__details--0'
    ) as HTMLDivElement;

    setTimeout(() => {
      this.cardOpacity = 'opacity: 100%';

      setTimeout(() => {
        this.cardOpacity = 'opacity: unset ';
      }, 100);
    }, 1);
  }

  getImageSrcBasedOnWidth(): string {
    const baseLink = 'http://image.tmdb.org/t/p/';
    const devWidth = this.windowDimensions.width;
    if (devWidth === 0) {
      return '';
    }
    if (devWidth <= 320) {
      return baseLink + 'w300' + this.titleDetails.posterPath;
    }
    if (devWidth <= 480) {
      return baseLink + 'w500' + this.titleDetails.posterPath;
    }
    if (devWidth <= 720) {
      return baseLink + 'w780' + this.titleDetails.backdropPath;
    } else {
      return baseLink + 'w1280' + this.titleDetails.backdropPath;
    }
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._isResizingSubscription.unsubscribe();
  }
}
