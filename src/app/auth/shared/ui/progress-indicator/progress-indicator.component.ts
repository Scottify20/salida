import { Component, Input } from '@angular/core';
import { ProgressIndicatorProps } from './progress-indicator.model';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [],
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.scss',
})
export class ProgressIndicatorComponent {
  @Input({ required: true }) progressIndicatorProps: ProgressIndicatorProps = {
    steps: 0,
    visitedSteps: 0,
  };

  // to fix the duplicated keys warning
  trackingArray = () => {
    let array: number[] = [];
    for (let i = 0; i < this.progressIndicatorProps.steps; i++) {
      array.push(i);
    }
    return array;
  };

  getGridTemplateColumnsStyle(): string {
    const template = `grid-template-columns: repeat(${this.progressIndicatorProps.steps}, 1fr)`;

    const gap = `column-gap: ${this.progressIndicatorProps.steps > 1 ? '0.5rem' : '0rem'}`;
    return `${template}; ${gap}`;
  }

  getGridColumnStyle() {
    return `grid-column: ${this.progressIndicatorProps.visitedSteps} / span 1`;
  }

  getColumnGap() {}
}
