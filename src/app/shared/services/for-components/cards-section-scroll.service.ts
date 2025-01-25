import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsSectionScrollService {
  // the key is the id of the section
  // the value is the scrollLeft position of the section
  positions: { [id: string]: number } = {};

  startScrollPositionSaving(containerElement: HTMLElement, id: string) {
    if (!containerElement) {
      return;
    }

    containerElement.scrollLeft = this.positions[id] || 0;

    fromEvent(containerElement, 'scroll')
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        tap((e) => {
          this.positions[id] = containerElement.scrollLeft;
          // console.log(containerElement.scrollLeft);
        }),
      )
      .subscribe();
  }

  resetAllScrollPositions() {
    this.positions = {};
  }
}
