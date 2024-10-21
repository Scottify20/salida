import { Component, computed, DestroyRef, signal } from '@angular/core';
import { ProgressIndicatorProps } from '../../../../shared/ui/progress-indicator/progress-indicator.model';
import { ProgressIndicatorComponent } from '../../../../shared/ui/progress-indicator/progress-indicator.component';
import { DividerWithTitleComponent } from '../../../../shared/ui/divider-with-title/divider-with-title.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DialogComponent,
  DialogProps,
} from '../../../../../shared/components/dialog/dialog.component';
import {
  usernameValidator,
  validUsernameCharRegex,
} from '../../../../validators/username-validator';
import { Router } from '@angular/router';
import { UserService } from '../../../../../core/user/user.service';
import { AuthError } from '@angular/fire/auth';
import { catchError, delay, fromEvent, map, of, take, tap } from 'rxjs';
import { SalidaAuthError } from '../../../../../shared/interfaces/types/api-response/SalidaAuthError';
import { SalidaAuthErrorSource } from '../../../../../shared/interfaces/types/api-response/SalidaError';
import {
  FirebaseAuthErrorSource,
  FirebaseAuthService,
} from '../../../../../core/auth/firebase-auth.service';
import { SalidaAuthService } from '../../../../../core/auth/salida-auth.service';
import { ToastsService } from '../../../../../toasts-container/data-access/toasts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlatformCheckService } from '../../../../../shared/services/dom/platform-check.service';

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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private salidaAuthService: SalidaAuthService,
    private firebaseAuthService: FirebaseAuthService,
    private toastsService: ToastsService,
    private destroyRef: DestroyRef,
    private platformCheckService: PlatformCheckService,
  ) {}

  authErrorMessageSig = signal<{ username: string | null }>({
    username: null,
  });
  usernameErrorMessageSig = signal<string>('');

  isSubmitActioninProgress = false;
  isAccountCreationSuccessful = signal(false);

  isSubmitted = false;
  // isUsernameAvailable = signal(false);
  // isUsernameSetOrIsSkipped = signal(false);
  // isUsernameValid = computed(
  //   () =>
  //     this.setUsernameForm.get('username')?.valid && this.isUsernameAvailable(),
  // );

  userDisplayPhotoURLSig = this.userService.userPhotoUrlSig || signal(null);

  ngOnInit() {
    this.startListeningForEnterKey();
  }

  startListeningForEnterKey() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    fromEvent(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }

        if (
          event.key === 'Enter' &&
          !this.confirmSetUsernameDialogProps.config.isOpenSig()
        ) {
          setTimeout(() => {
            this.onSetUsernameButtonClicked();
          }, 100);
        }
      });
  }

  setUsernameForm = this.fb.group({
    username: ['', [Validators.required, usernameValidator()]],
  });

  isSetUsernameButtonDisabled(): boolean {
    return this.isUsernamePatternInvalid() || this.isSubmitActioninProgress;
  }

  isUsernamePatternInvalid(): boolean {
    return this.setUsernameForm.get('username')?.invalid ? true : false;
  }

  usernameErrorMessages(): string[] {
    const errorMessages: string[] = [];
    const usernameControl = this.setUsernameForm.get('username');

    if (
      usernameControl?.hasError('required') &&
      (usernameControl.dirty || usernameControl.touched)
    ) {
      errorMessages.push('Username is required.');
      return errorMessages;
    }

    const usernameErrors = usernameControl?.errors?.['invalidUsername'];

    if (usernameErrors?.invalidCharacter) {
      errorMessages.push('Username contains invalid characters.');
      // return errorMessages;
    }

    if (usernameErrors?.hasNonLetterAsFirstCharacter) {
      errorMessages.push('Username must start with a letter.');
      return errorMessages;
    }

    if (usernameErrors?.minLength || usernameErrors?.maxLength) {
      errorMessages.push('Username must be 8 to 20 characters long.');
      // return errorMessages;
    }

    if (usernameErrors?.containsWhitespace) {
      errorMessages.push('Username cannot contain spaces.');
      // return errorMessages;
    }

    // Add more specific error messages as needed based on your validator

    return errorMessages;
  }

  usernameInvalidCharactersChecker(): { char: string; invalid: boolean }[] {
    const rawUsername =
      this.setUsernameForm.get('username')?.getRawValue() || '';
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = segmenter.segment(rawUsername);
    const characters = Array.from(segments).map((segment) => segment.segment);

    return characters.map((char) => {
      return validUsernameCharRegex.test(char)
        ? { char: char, invalid: false }
        : { char: char, invalid: true };
    });
  }

  onSkip() {
    this.skipUsernameDialogProps.config.isOpenSig.set(true);
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

  setUsername() {
    const username = this.setUsernameForm.get('username')?.getRawValue();
    this.userService
      .setUsernameForUser(username)
      .pipe(
        take(1),
        tap((response) => {
          console.log(response);
          this.confirmSetUsernameDialogProps.config.isOpenSig.set(false);
          this.isAccountCreationSuccessful.set(true);
          this.createAccountSuccessDialogProps.config.isOpenSig.set(true);
        }),
        catchError((error) => {
          this.setAuthErrorMessages(error);
          this.confirmSetUsernameDialogProps.config.isOpenSig.set(false);
          this.confirmSetUsernameDialogProps.buttons.primary.isBusySig?.set(
            false,
          );

          this.confirmSetUsernameDialogProps.buttons.secondary?.isHiddenSig?.set(
            false,
          );
          // this.createAccountSuccessDialogProps.config.isOpenSig.set(true);
          return of(null);
        }),
      )
      .subscribe();
    // throw new Error('Method not implemented.');
  }

  private setAuthErrorMessages(
    error: Error | AuthError | SalidaAuthError | any,
  ) {
    let errorSource:
      | SalidaAuthErrorSource
      | FirebaseAuthErrorSource
      | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    if (error instanceof SalidaAuthError) {
      const salidaAuthError =
        this.salidaAuthService.getSalidAuthErrorMessage(error);
      errorSource = salidaAuthError.errorSource;
      errorMessage = salidaAuthError.message;
    } else if (
      error.name === 'FirebaseError' &&
      error.hasOwnProperty('code') &&
      /auth/.test(error.code)
    ) {
      const firebaseAuthError =
        this.firebaseAuthService.getFirebaseAuthErrorMessage(error.code);
      errorSource = firebaseAuthError?.errorSource;
      errorMessage = firebaseAuthError?.message;

      // if the getFirebaseAuthErrorMessage function returns null, return and do not show any error message
      // the function returns null when the message isnt supposed to be seen by the user.
      if (!errorSource || !errorMessage) {
        return;
      }
    }

    if (!errorSource || !errorMessage) {
      this.toastsService.addToast({
        iconPath: '/assets/icons/toast/error.svg',
        text: 'An unexpected error has occurred.',
        scope: 'route',
      });
      return;
    }

    if (errorSource == 'general') {
      this.toastsService.addToast({
        iconPath: '/assets/icons/toast/error.svg',
        text: errorMessage,
        scope: 'route',
      });
    }

    this.authErrorMessageSig.set({
      username: errorSource === 'username' ? errorMessage : null,
    });
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
          this.confirmSetUsernameDialogProps.buttons.primary.isBusySig?.set(
            true,
          );

          this.confirmSetUsernameDialogProps.buttons.secondary?.isHiddenSig?.set(
            true,
          );
        },
        isBusySig: signal(false),
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          this.confirmSetUsernameDialogProps.config.isOpenSig.set(false);

          this.confirmSetUsernameDialogProps.buttons.primary.isBusySig?.set(
            false,
          );
        },
      },
    },
  };

  skipUsernameDialogProps: DialogProps = {
    config: {
      id: 'skip-username-dialog',
      isBackdropEnabled: true,
      isOpenSig: signal(null),
      triggerElementIds: ['skip-username-setting-button'],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/warning.svg',
      title: 'Skip setting username?',
      textItems: ['You can set your username later in your user profile.'],
    },
    buttons: {
      primary: {
        type: 'warning',
        label: 'Skip',
        onClickCallback: () => {
          setTimeout(() => {
            this.isAccountCreationSuccessful.set(true);
            this.createAccountSuccessDialogProps.config.isOpenSig.set(true);
          }, 200);
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          // dialog automatically closed // proceed to setting username
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
      iconPath: 'assets/icons/dialog/success.svg',
      title: 'Account successfully created.',
      textItems: ['You can now access all of Salida’s features.'],
    },
    buttons: {
      primary: {
        type: 'success',
        label: 'Proceed',
        onClickCallback: () => {
          try {
            this.router.navigateByUrl('/');
            setTimeout(() => {
              window.location.reload();
            }, 0);
          } catch {}
        },
      },
    },
  };

  progressIndicatorProps: ProgressIndicatorProps = {
    visitedSteps: 2,
    steps: 2,
  };
}
