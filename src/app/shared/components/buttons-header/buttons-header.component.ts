import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderButton } from './buttons-header.model';

@Component({
  selector: 'app-buttons-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buttons-header.component.html',
  styleUrl: './buttons-header.component.scss',
})
export class ButtonsHeaderComponent {
  @Input() headerButtons: HeaderButton[] = [];

  getIconPath(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
  }
}
