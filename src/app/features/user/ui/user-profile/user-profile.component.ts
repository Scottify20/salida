import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderButtonsComponent } from '../../../../shared/components/header-buttons/header-buttons.component';
import { HeaderButtonProps } from '../../../../shared/components/header-button/header-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [HeaderButtonsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private router = inject(Router);


  headerButtons: HeaderButtonProps[] = [
    {
      type: 'icon',
      iconPath: '/assets/icons/header/Back.svg',
      ariaLabel: 'Go back',
      onClickCallbackFn: () => {
        history.back();
      },
    },
    {
      type: 'icon',
      iconPath: '/assets/icons/header/Edit.svg',
      onClickCallbackFn: () => {
        this.router.navigateByUrl('/user/**/edit');
      },
      ariaLabel: 'Edit profile',
    },
  ];
}
