import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-dots',
    imports: [],
    templateUrl: './loading-dots.component.html',
    styleUrl: './loading-dots.component.scss'
})
export class LoadingDotsComponent {
  @Input() dotsCount: 1 | 2 | 3 | 4 | 5 = 5;
  @Input() dotsColor: string = '#00000';

  get dotsCountArray() {
    return Array.from({ length: this.dotsCount }, (_, index) => index + 1);
  }
}
