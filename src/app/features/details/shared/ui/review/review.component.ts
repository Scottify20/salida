import { Component, ElementRef, Input } from '@angular/core';
import { Review } from '../../../../../shared/interfaces/models/tmdb/All';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [DatePipe],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  constructor(public elementRef: ElementRef) {}
  @Input({ required: true }) props!: Review | null;
  @Input({ required: true }) isModal: boolean = false;

  get ratingColorClass(): 'green' | 'yellow-green' | 'yellow' | 'red' | '' {
    const rating = this.props?.author_details?.rating;
    const r = parseFloat(rating?.toFixed(1) || '0') || 0;

    if (r >= 7) return 'green';
    if (r >= 5) return 'yellow-green';
    if (r > 3) return 'yellow';
    if (r > 0) return 'red';
    return '';
  }
}
