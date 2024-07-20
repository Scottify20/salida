import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollPositionService {
  private scrollPositions = new Map<string, number>();

  savePosition(route: string, position: number): void {
    this.scrollPositions.set(route, position);
  }

  getPosition(route: string): number {
    return this.scrollPositions.get(route) || 0;
  }
}
