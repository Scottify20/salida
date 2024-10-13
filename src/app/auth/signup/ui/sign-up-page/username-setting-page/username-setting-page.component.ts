import { Component, DestroyRef, signal, WritableSignal } from '@angular/core';
import { ProgressIndicatorProps } from '../../../../shared/ui/progress-indicator/progress-indicator.model';
import { ProgressIndicatorComponent } from '../../../../shared/ui/progress-indicator/progress-indicator.component';
import { DividerWithTitleComponent } from '../../../../shared/ui/divider-with-title/divider-with-title.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalidaAuthService } from '../../../../../core/auth/salida-auth.service';
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';
import { DialogProps } from '../../../../../shared/components/dialog/dialog.model';

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
    private destroyRef: DestroyRef,
    private salidaAuthService: SalidaAuthService,
  ) {}

  progressIndicatorProps: ProgressIndicatorProps = {
    visitedSteps: 2,
    steps: 2,
  };

  // @ViewChild('setUsernameButton') setUsernameButton!: ElementRef;

  passwordInputType: 'text' | 'password' = 'password';
  isSubmittedAtleastOnce = false;
  isSubmitActioninProgress = false;

  usernameErrorMessageSig = signal<string>('');

  isSubmitted = false;

  // ngAfterViewInit() {

  //   // listening
  //     fromEvent(
  //       this.setUsernameButton.nativeElement,
  //       'click',
  //     ).pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       tap(() => {
  //         this.onSetUsername();
  //       }),
  //     ).subscribe()
  // }

  setUsernameForm = this.fb.group({
    username: ['', [Validators.required]],
  });

  onSetUsername() {
    this.isSubmitted = true;

    if (
      this.setUsernameForm.valid &&
      this.confirmSetUsernameDialogProps.mainContent.textItems
    ) {
      const username = this.setUsernameForm.get('username')?.getRawValue();

      this.confirmSetUsernameDialogProps.mainContent.textItems[0] = `Are you sure you want to set “${username}” as your username? This cannot be changed later.`;
    }

    this.isConfirmSetUsernameDialogOpenSig.set(true);
  }

  onSkip() {
    this.isSkipUsernameDialogOpenSig.set(true);
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

  isConfirmSetUsernameDialogOpenSig: WritableSignal<null | boolean> =
    signal(null); // should be null by default to prevent initial open or closed animation
  confirmSetUsernameDialogProps: DialogProps = {
    config: {
      id: 'confirm-set-username-dialog',
      isBackdropEnabled: true,
      isOpenSig: this.isConfirmSetUsernameDialogOpenSig,
      triggerElementIds: ['username-setting-button'],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/warning.svg',
      title: 'Set Username?',
      textItems: [],
    },
    buttons: {
      primary: {
        type: 'success',
        label: 'Set',
        onClickCallback: () => {
          console.log('clicked primary');

          this.isCreateAccountSuccessDialogOpenSig.set(true);
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          console.log('clicked secondary');
        },
      },
    },
  };

  isSkipUsernameDialogOpenSig: WritableSignal<null | boolean> = signal(null); // should be null by default to prevent initial open or closed animation
  skipUsernameDialogProps: DialogProps = {
    config: {
      id: 'skip-username-dialog',
      isBackdropEnabled: false,
      isOpenSig: this.isSkipUsernameDialogOpenSig,
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
          console.log('clicked primary');
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          console.log('clicked secondary');
        },
      },
    },
  };

  isCreateAccountSuccessDialogOpenSig: WritableSignal<null | boolean> =
    signal(null); // should be null by default to prevent initial open or closed animation
  createAccountSuccessDialogProps: DialogProps = {
    config: {
      id: 'account-creation-success-dialog',
      isBackdropEnabled: true,
      isOpenSig: this.isCreateAccountSuccessDialogOpenSig,
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
