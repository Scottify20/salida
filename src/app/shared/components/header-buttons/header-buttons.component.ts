import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderButtonProps } from '../header-button/header-button.component';
import { ExtractStringService } from '../../services/utility/extract-string.service';

@Component({
  selector: 'app-header-buttons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-buttons.component.html',
  styleUrl: './header-buttons.component.scss',
})
export class HeaderButtonsComponent {
  @Input() headerButtons: HeaderButtonProps[] = [];

  constructor(protected extractStringService: ExtractStringService) {}

  callOnClickCallbackFn(callback: undefined | (() => void)) {
    if (callback) {
      callback();
    }
  }
}
