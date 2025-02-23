import { Component, ElementRef, Input, inject } from '@angular/core';
import { Review } from '../../../../../shared/interfaces/models/tmdb/All';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [DatePipe],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  elementRef = inject(ElementRef);

  @Input({ required: true }) props!: Review | null;
  @Input({ required: true }) isModal: boolean = false;
}
