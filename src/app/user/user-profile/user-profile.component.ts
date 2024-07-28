import { Component } from '@angular/core';
import {
  ButtonsHeaderComponent,
  HeaderButton,
} from '../../shared/components/buttons-header/buttons-header.component';
import { Navigation } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ButtonsHeaderComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  constructor(private location: Location) {}

  headerButtons: HeaderButton[] = [
    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/Back.svg',
      anchor: {
        urlType: 'internal',
        path: '/',
        target: '_self',
      },
    },
    {
      type: 'iconWithBG',
      iconPath: 'assets/icons/header/Edit.svg',
      anchor: {
        urlType: 'internal',
        path: '/edit',
        target: '_self',
      },
    },
  ];
}
