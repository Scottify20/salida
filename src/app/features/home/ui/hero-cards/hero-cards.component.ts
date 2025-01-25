import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IntersectionObserverService } from '../../../../shared/services/dom/intersection-observer.service';
import { PlatformCheckService } from '../../../../shared/services/dom/platform-check.service';
import { ScrollButtonsComponent } from '../../../../shared/components/scroll-buttons/scroll-buttons.component';
import { MediaSummary } from '../../../../shared/interfaces/models/tmdb/All';
import {
  HeroCardComponent,
  HeroCardProps,
} from '../hero-card/hero-card.component';
import { HeroCardsService } from '../../data-access/hero-cards.service';

@Component({
  selector: 'app-hero-cards',
  imports: [CommonModule, HeroCardComponent, ScrollButtonsComponent],
  templateUrl: './hero-cards.component.html',
  styleUrl: './hero-cards.component.scss',
})
export class HeroCardsComponent implements AfterViewInit, OnDestroy {
  constructor(
    private intersectionObserverService: IntersectionObserverService,
    private platformCheckService: PlatformCheckService,
    private heroCardsService: HeroCardsService,
  ) {}

  indexOfFullyVisibleCard: number = 0;

  @Input({ required: true }) props: HeroCardProps[] = [];

  ngAfterViewInit() {
    try {
      this.heroCardsService.startScrollDetection();
      this.startCardsScrollBasedAnimation();
    } catch (error) {
      console.error('Error during ngAfterViewInit:', error);
    }
  }

  get cards(): NodeListOf<Element> | undefined {
    return this.platformCheckService.isServer()
      ? undefined
      : document.querySelectorAll('.hero-card');
  }

  get posters(): NodeListOf<Element> | undefined {
    return this.platformCheckService.isBrowser()
      ? document.querySelectorAll('.hero-card__poster')
      : undefined;
  }

  public stopCardsScrollBasedAnimation() {
    this.cards?.forEach((card) =>
      this.intersectionObserverService.unobserve(card),
    );
  }

  public startCardsScrollBasedAnimation() {
    try {
      if (this.platformCheckService.isServer()) return;

      const options = {
        threshold: Array.from({ length: 11 }, (_, i) => i * 0.1),
      };

      const intersectionHandlerCallback = (
        entries: IntersectionObserverEntry[],
      ) => {
        const entry = entries[0];
        const intersectRatio = entry.intersectionRatio;
        const card = entry.target as HTMLElement;
        const indexOfCard = parseInt(
          card.getAttribute('data-card-index') as string,
        );

        if (intersectRatio >= 0.8) {
          this.indexOfFullyVisibleCard = indexOfCard;
        }

        if (this.indexOfFullyVisibleCard !== indexOfCard) {
          card.style.transform = `scale(${0.8 + (1 - 0.8) * intersectRatio + 0.05})`;
          card.style.opacity = `${intersectRatio * 100 + 25}%`;
        } else if (window.matchMedia('(hover: hover)').matches) {
          if (window.scrollY < 70) {
            card.style.transform = `scale(${Math.max(0.8, 1 * intersectRatio)})`;
          }
          card.style.opacity = `100%`;
        }
      };

      this.cards?.forEach((card) =>
        this.intersectionObserverService.observe(
          card,
          intersectionHandlerCallback,
          options,
        ),
      );
    } catch (error) {
      console.error('Error during startCardsScrollBasedAnimation:', error);
    }
  }

  ngOnDestroy() {
    this.stopCardsScrollBasedAnimation();
  }
}

export interface HeroTitle {
  title: string;
  id: number;
  posterPath: string;
  backdropPath: string;
  plot: string;
  genres: string[];
  logoPath?: string;
  releaseDate?: string;
}
