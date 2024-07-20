import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { dot } from 'node:test/reporters';
import { IntersectionObserverService } from '../../shared/services/intersection-observer.service';
import { PlatformCheckService } from '../../shared/services/platform-check.service';
@Component({
  selector: 'app-hero-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-cards.component.html',
  styleUrl: './hero-cards.component.scss',
})
export class HeroCardsComponent implements OnInit, OnDestroy {
  indexOfFullyVisibleCard: number = 0;

  titles: { posterUrl: string }[] = [
    { posterUrl: '../../../../assets/temp/posters/poster-large.jpg' },
    { posterUrl: '../../../../assets/temp/posters/poster-large-2.jpg' },
    { posterUrl: '../../../../assets/temp/posters/poster-large-3.jpg' },
    { posterUrl: '../../../../assets/temp/posters/poster-large-4.jpg' },
    { posterUrl: '../../../../assets/temp/posters/poster-large-5.jpg' },
  ];

  constructor(
    private intersectionObserverService: IntersectionObserverService,
    private platformCheckService: PlatformCheckService
  ) {}

  get cards(): NodeListOf<Element> | undefined {
    if (this.platformCheckService.isServer()) {
      return undefined;
    } else {
      const cards = document.querySelectorAll('.hero-card');
      return cards ? cards : undefined;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}

  public stopCardsScrollBasedAnimation() {
    this.cards?.forEach((card) => {
      this.intersectionObserverService.unobserve(card);
    });
  }

  public startCardsScrollBasedAnimation() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    const options = {
      // threshold: [
      //   0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
      //   0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
      // ],

      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const intersectionHandlerCallback = (
      entries: IntersectionObserverEntry[]
    ) => {
      entries.forEach((entry) => {
        const intersectRatio = entry.intersectionRatio;
        const card = entry.target as HTMLElement;
        const indexOfCard = parseInt(
          card.getAttribute('data-card-index') as string
        );

        if (intersectRatio >= 0.8) {
          this.indexOfFullyVisibleCard = indexOfCard;
        }

        if (this.indexOfFullyVisibleCard !== indexOfCard) {
          card.style.transform = `scale(${
            0.78 + (1 - 0.78) * intersectRatio + 0.05
          })`;
          card.style.opacity = `${intersectRatio * 100 + 10}%`;
        }

        // if (indexOfCard === 0) {
        //   console.log(intersectRatio);
        // }
      });
    };

    if (this.cards) {
      this.cards.forEach((card) => {
        const observer = this.intersectionObserverService;
        observer.observe(card, intersectionHandlerCallback, options);
      });
    }
  }
}
