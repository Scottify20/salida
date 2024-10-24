import { Component, Input, Signal } from '@angular/core';

export type HeaderButton =
  | {
      type: 'text';
      text: string | Signal<string | null | undefined> | (() => string);
      id?: string;
      onClickCallbackFn?: () => void;
    }
  | {
      type: 'icon';
      iconPath: string | Signal<string | null | undefined> | (() => string);
      id?: string;
      onClickCallbackFn?: () => void;
    };

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss',
})
export class HeaderButtonComponent {
  @Input({ required: true }) headerButtonProps!: HeaderButton;

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
