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
}
