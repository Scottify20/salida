import { effect, Injectable } from '@angular/core';
import { fromEvent, tap, throttleTime } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class HeroCardsService {
  constructor(private homeService: HomeService) {
    effect(() => {
      this.homeService.selectedContentTypeIndex();
      this.savedHeroCardsScrollX = 0;
    });
  }

  cardsContainer!: HTMLElement;

  savedHeroCardsScrollX: number = 0;

  startScrollDetection() {
    if (!this.cardsContainer) {
      return;
    }

    fromEvent(this.cardsContainer, 'scroll')
      .pipe(
        throttleTime(200),
        tap((e) => {
          this.savedHeroCardsScrollX = this.cardsContainer.scrollLeft;
        }),
      )
      .subscribe();
  }

  setScrollPosition() {
    this.cardsContainer.scrollLeft = this.savedHeroCardsScrollX;
  }
}
