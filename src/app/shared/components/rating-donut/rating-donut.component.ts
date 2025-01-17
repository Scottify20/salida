import { Component, inject, Input, signal } from '@angular/core';
import { PlatformCheckService } from '../../services/dom/platform-check.service';

@Component({
  selector: 'app-rating-donut',
  imports: [],
  templateUrl: './rating-donut.component.html',
  styleUrl: './rating-donut.component.scss',
})
export class RatingDonutComponent {
  animatedRatingForCircle = signal(0);
  animatedRatingForText = signal(0);
  @Input({ required: true }) rating: number = 0; // Must be 0 to 10
  @Input() animate: boolean = false;

  private platformCheck = inject(PlatformCheckService);
  ngAfterViewInit() {
    if (this.animate && this.platformCheck.isBrowser()) {
      this.animateRating();
    }
  }

  animateRating() {
    const totalTime = 1500;
    this.animatedRatingForCircle.set(this.rating);

    // Start the text animation
    const totalSteps = 20;
    const stepTime = totalTime / totalSteps; // Time per step

    let currentStep = 0;

    const animateTextStep = () => {
      if (currentStep <= totalSteps) {
        // Calculate the progress for the text
        const progress = currentStep / totalSteps;
        const newRating = this.rating * progress;

        // Update the text value
        this.animatedRatingForText.set(newRating);
        currentStep++;

        // Schedule the next step
        setTimeout(animateTextStep, stepTime);
      } else {
        // Ensure final value is set
        this.animatedRatingForText.set(this.rating);
      }
    };

    // Start the text animation
    animateTextStep();
  }

  get ratingColorClass(): 'green' | 'yellow' | 'red' | '' {
    const r = this.rating;

    if (r > 6.0) return 'green';
    if (r >= 4.0) return 'yellow';
    if (r > 0) return 'red';
    return '';
  }
}
