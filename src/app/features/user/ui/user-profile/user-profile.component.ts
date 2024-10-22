import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  HeaderButton,
  HeaderButtonsComponent,
} from '../../../../shared/components/header-buttons/header-buttons.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderButtonsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  constructor(private router: Router) {}

  headerButtons: HeaderButton[] = [
    {
      type: 'icon',
      iconPath: 'assets/icons/header/Back.svg',
      onClickCallbackFn: () => {
        history.back();
      },
    },
    {
      type: 'icon',
      iconPath: 'assets/icons/header/Edit.svg',
      onClickCallbackFn: () => {
        this.router.navigateByUrl('/user/**/edit');
      },
    },
  ];
}
