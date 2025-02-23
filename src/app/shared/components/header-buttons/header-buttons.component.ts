import { Component, Input, Signal, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HeaderButtonProps } from '../header-button/header-button.component';
import { ExtractStringService } from '../../services/utility/extract-string.service';

@Component({
    selector: 'app-header-buttons',
    imports: [RouterModule],
    templateUrl: './header-buttons.component.html',
    styleUrl: './header-buttons.component.scss'
})
export class HeaderButtonsComponent {
  protected extractStringService = inject(ExtractStringService);

  @Input() headerButtons: HeaderButtonProps[] = [];

  callOnClickCallbackFn(callback: undefined | (() => void)) {
    if (callback) {
      callback();
    }
  }
}
