import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TmdbTitle } from '../hero-cards/hero-cards.component';
import { WindowResizeService } from '../../shared/services/window-resize.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent implements OnInit, OnDestroy {
  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  private resizeSubscription!: Subscription;
  private isResizingSubscription!: Subscription;

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

  constructor(private windowResizeService: WindowResizeService) {}
  ngOnInit() {
    this.windowDimensions = { width: 0, height: 0 };

    this.resizeSubscription =
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this.isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });

    // Ensure the initial values are set
    this.windowResizeService.isResizing();
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

  // getImageAlt():string {

  // }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
    this.isResizingSubscription.unsubscribe();
  }
}
