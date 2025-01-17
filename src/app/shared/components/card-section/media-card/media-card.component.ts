import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MediaSummary } from '../../../interfaces/models/tmdb/All';
import { PlatformCheckService } from '../../../services/dom/platform-check.service';

export interface MediaCardProps extends MediaSummary {
  onClick: () => void;
  media_type: 'movie' | 'tv';
}

@Component({
  selector: 'app-media-card',
  imports: [],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  constructor(private platformCheck: PlatformCheckService) {}

  @Input() props: MediaCardProps = {} as MediaCardProps;

  @ViewChild('ratingPie') ratingPieRef!: ElementRef;

  ngAfterViewInit() {
    if (!this.platformCheck.isBrowser()) {
      return;
    }
    const ratingPieEl = this.ratingPieRef.nativeElement as HTMLCanvasElement;
    this.drawProgressCircle(ratingPieEl, this.props.vote_average * 10);
  }

  drawProgressCircle(el: HTMLCanvasElement, percent: number) {
    let context = el.getContext('2d') as CanvasRenderingContext2D;
    let centerX = el.width / 2;
    let centerY = el.height / 2;
    let radius = 70;

    let endAngle = 0;

    /* draw the grey circle */
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = '#242528';
    context.fill();
    context.strokeStyle = 'rgba(200, 208, 218, 0)';
    context.stroke();

    /* draw the green circle based on percentage */
    let startAngle = 1.5 * Math.PI;
    let unitValue = (Math.PI - 0.5 * Math.PI) / 25;
    if (percent >= 0 && percent <= 25) {
      endAngle = startAngle + percent * unitValue;
    } else if (percent > 25 && percent <= 50) {
      endAngle = startAngle + percent * unitValue;
    } else if (percent > 50 && percent <= 75) {
      endAngle = startAngle + percent * unitValue;
    } else if (percent > 75 && percent <= 100) {
      endAngle = startAngle + percent * unitValue;
    }

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
    context.closePath();
    context.fillStyle = '#2cb191';
    context.fill();
  }

  getPosterAlt() {
    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }
}
