import { Component, computed, signal } from '@angular/core';
import { ProgressIndicatorProps } from '../../../../shared/ui/progress-indicator/progress-indicator.model';
import { ProgressIndicatorComponent } from '../../../../shared/ui/progress-indicator/progress-indicator.component';
import { DividerWithTitleComponent } from '../../../../shared/ui/divider-with-title/divider-with-title.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DialogComponent,
  DialogProps,
} from '../../../../../shared/components/dialog/dialog.component';
import { usernameValidator } from '../../../../validators/username-validator';

@Component({
  selector: 'app-username-setting-page',
  standalone: true,
  imports: [
    ProgressIndicatorComponent,
    DividerWithTitleComponent,
    ReactiveFormsModule,
    DialogComponent,
  ],
  templateUrl: './username-setting-page.component.html',
  styleUrl: './username-setting-page.component.scss',
})
export class UsernameSettingPageComponent {
  constructor(private fb: FormBuilder) {}

  progressIndicatorProps: ProgressIndicatorProps = {
    visitedSteps: 2,
    steps: 2,
  };

  passwordInputType: 'text' | 'password' = 'password';
  isSubmittedAtleastOnce = false;
  isSubmitActioninProgress = false;

  usernameErrorMessageSig = signal<string>('');

  isSubmitted = false;
  isUsernameAvailable = signal(false);
  isUsernameSetOrIsSkipped = signal(false);
  isUsernameValid = computed(
    () =>
      this.setUsernameForm.get('username')?.valid && this.isUsernameAvailable(),
  );

  setUsernameForm = this.fb.group({
    username: ['', [Validators.required, usernameValidator()]],
  });

  setUsername() {
    throw new Error('Method not implemented.');
  }

  usernameErrorMessages(): string[] {
    const errorMessages: string[] = [];

    // if (
    //   !this.setUsernameForm.get('password')?.dirty &&
    //   !this.setUsernameForm.get('password')?.touched &&
    //   !this.isSubmitted
    // ) {
    //   return [];
    // }

    const usernameErrors =
      this.setUsernameForm.controls.username.errors?.['invalidUsername'];

    if (this.setUsernameForm.get('username')?.hasError('required')) {
      errorMessages.push('Username is required.');
      return errorMessages;
    }

    if (usernameErrors.minLength || usernameErrors.maxLength) {
      errorMessages.push('Password must be 8 to 16 characters long.');
      return errorMessages;
    }

    if (usernameErrors.hasNonLetterAsFirstCharacter) {
      errorMessages.push('Username must start with a letter.');
      return errorMessages;
    }

    if (usernameErrors.containsWhitespace) {
      errorMessages.push('Spaces not allowed.');
      return errorMessages;
    }

    if (
      this.setUsernameForm.get('username')?.invalid ||
      usernameErrors.invalidCharacter
    ) {
      errorMessages.push('Invalid username.');
      return errorMessages;
    }

    return errorMessages;
  }

  onSetUsernameButtonClicked() {
    this.isSubmitted = true;

    if (
      this.setUsernameForm.valid &&
      this.confirmSetUsernameDialogProps.mainContent.textItems
    ) {
      const username = this.setUsernameForm.get('username')?.getRawValue();
      this.confirmSetUsernameDialogProps.mainContent.textItems[0] = `Are you sure you want to set “${username}” as your username? This cannot be changed later.`;
      this.confirmSetUsernameDialogProps.config.isOpenSig.set(true);
    }
  }

  onSkip() {
    this.skipUsernameDialogProps.config.isOpenSig.set(true);
  }

  // private handleUsernameSetSuccess(accountIdentifier: string | null) {}

  // private setAuthErrorMessages(error: Error | SalidaAuthError | any) {
  //   let errorSource: SalidaAuthErrorSource | undefined = undefined;
  //   let errorMessage: string | undefined = undefined;

  //   if (error instanceof SalidaAuthError) {
  //     const salidaAuthError =
  //       this.salidaAuthService.getSalidAuthErrorMessage(error);
  //     errorSource = salidaAuthError.errorSource;
  //     errorMessage = salidaAuthError.message;
  //   }
  // }

  isSetUsernameButtonDisabled(): boolean {
    return this.isUsernamePatternInvalid() || this.isSubmitActioninProgress;
  }

  isUsernamePatternInvalid(): boolean {
    return this.setUsernameForm.get('username')?.invalid ? true : false;
  }

  confirmSetUsernameDialogProps: DialogProps = {
    config: {
      id: 'confirm-set-username-dialog',
      isBackdropEnabled: true,
      isOpenSig: signal(null),
      triggerElementIds: ['username-setting-button'],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/profile.svg',
      title: 'Set Username?',
      textItems: [],
    },
    buttons: {
      primary: {
        type: 'success',
        label: 'Set',
        onClickCallback: () => {
          this.setUsername();
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          // console.log('clicked secondary');
        },
      },
    },
  };

  skipUsernameDialogProps: DialogProps = {
    config: {
      id: 'skip-username-dialog',
      isBackdropEnabled: false,
      isOpenSig: signal(null),
      triggerElementIds: ['skip-username-setting-button'],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/warning.svg',
      title: 'Skip setting username?',
      textItems: ['You can set your username later in your user profile page.'],
    },
    buttons: {
      primary: {
        type: 'warning',
        label: 'Skip',
        onClickCallback: () => {
          this.createAccountSuccessDialogProps.config.isOpenSig.set(true);
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          // proceeded to setting username
        },
      },
    },
  };

  createAccountSuccessDialogProps: DialogProps = {
    config: {
      id: 'account-creation-success-dialog',
      isBackdropEnabled: true,
      isOpenSig: signal(null),
      triggerElementIds: [],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/warning.svg',
      title: 'Account successfully created.',
      textItems: ['You can now access all of Salida’s features.'],
    },
    buttons: {
      primary: {
        type: 'success',
        label: 'Proceed',
        onClickCallback: () => {
          console.log('clicked primary');
        },
      },
    },
  };
}
