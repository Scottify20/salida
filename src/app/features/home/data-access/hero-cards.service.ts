import { effect, Injectable, inject, signal } from '@angular/core';
import { fromEvent, tap, throttleTime } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class HeroCardsService {
  private homeService = inject(HomeService);

  constructor() {
    effect(() => {
      this.homeService.selectedContentTypeIndex();
      this.savedHeroCardsScrollX = 0;
    });
  }

  cardsContainer!: HTMLElement;

  savedHeroCardsScrollX: number = 0;
  cardDetailsVisible = signal(false);

  startScrollDetection() {
    if (!this.cardsContainer) {
      return;
    }

    fromEvent(this.cardsContainer, 'scroll')
      .pipe(
        throttleTime(200),
        tap((e) => {
          this.savedHeroCardsScrollX = this.cardsContainer.scrollLeft;
          this.cardDetailsVisible.set(true);
        }),
      )
      .subscribe();
  }

  setScrollPosition() {
    this.cardsContainer.scrollLeft = this.savedHeroCardsScrollX;
  }
}
