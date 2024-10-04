import { DestroyRef, Inject, Injectable } from '@angular/core';
import { ScrollDetectorService } from '../../shared/services/dom/scroll-detector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, take, tap, throttleTime } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HeroCardsService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  savedHeroCardsScrollX: number = 0;

  startScrollDetection() {
    const cardsContainer = this.document.getElementById(
      'hero__cards-container',
    ) as HTMLDivElement;

    if (!cardsContainer) {
      return;
    }

    cardsContainer.scrollLeft = this.savedHeroCardsScrollX;

    fromEvent(cardsContainer, 'scroll')
      .pipe(
        throttleTime(500),
        tap((e) => {
          this.savedHeroCardsScrollX = cardsContainer.scrollLeft;
        }),
      )
      .subscribe();
  }
}
