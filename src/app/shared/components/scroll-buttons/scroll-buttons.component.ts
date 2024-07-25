import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-buttons',
  standalone: true,
  imports: [],
  templateUrl: './scroll-buttons.component.html',
  styleUrl: './scroll-buttons.component.scss',
})
export class ScrollButtonsComponent {
  @Input() positionValues: positionValues = { top: '0', left: '0', right: '0' };
}

type positionValues = {
  top: string;
  left?: string;
  right?: string;
};
