import { Component, Input, Signal } from '@angular/core';
import { ExtractStringService } from '../../services/utility/extract-string.service';

export type HeaderButtonProps = {
  ariaLabel: string;
  type: 'text' | 'icon';
  iconPath?: string | Signal<string | null | undefined> | (() => string);
  text?: string | Signal<string | null | undefined> | (() => string);
  onClickCallbackFn?: () => void;
  id?: string;
};

@Component({
  selector: 'app-header-button',
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss',
})
export class HeaderButtonComponent {
  @Input({ required: true }) props!: HeaderButtonProps;

  constructor(protected extractStringService: ExtractStringService) {}

  callOnClickCallbackFn(callback: undefined | (() => void)) {
    if (callback) {
      callback();
    }
  }
}
