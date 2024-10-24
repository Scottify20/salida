import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderButton } from '../header-button/header-button.component';

@Component({
  selector: 'app-header-buttons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-buttons.component.html',
  styleUrl: './header-buttons.component.scss',
})
export class HeaderButtonsComponent {
  @Input() headerButtons: HeaderButton[] = [];

  getTextOrIconPath(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
  }

  callOnClickCallbackFn(callback: undefined | (() => void)) {
    if (callback) {
      callback();
    }
  }
}
