import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonsHeaderComponent,
  HeaderButton,
} from '../../../shared/components/buttons-header/buttons-header.component';
import { CapsLockDetectorDirective } from '../../../shared/directives/caps-lock-detector.directive';
import { SocialsSignInComponent } from '../../shared/socials-sign-in/socials-sign-in.component';
import { RouterModule } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonsHeaderComponent,
    CapsLockDetectorDirective,
    SocialsSignInComponent,
    RouterModule,
    ModalComponent,
  ],
  templateUrl: '../ui/login-page/login-page.component.html',
  styleUrl: '../ui/login-page/login-page.component.scss',
})
export class LoginPageComponent {
  constructor(
    private fb: FormBuilder,
    private firebaseAuthService: FirebaseAuthService
  ) {}

  passwordInputType: 'text' | 'password' = 'password';

  isSubmitted = false;
  shakeError = false;

  firebaseAuthGeneralErrorMessageSignal = signal<null | string>(null);
  firebaseAuthEmailErrorMessageSignal = signal<null | string>(null);
  firebaseAuthPasswordErrorMessageSignal = signal<null | string>(null);

  firebaseEmailErrorMessagesResetSubscription: Subscription | null = null;
  firebasePasswordErrorMessagesResetSubscription: Subscription | null = null;

  registrationSubscription: Subscription | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  // loginForm = this.fb.group({
  //   email: ['', [Validators.required]],
  //   password: ['', [Validators.required]],
  //   keepLoggedIn: [false],
  // });

  ngAfterViewInit() {
    this.firebaseEmailErrorMessagesResetSubscription =
      this.loginForm.controls.email.valueChanges
        .pipe(
          tap((email) => {
            this.firebaseAuthEmailErrorMessageSignal.set(null);
          })
        )
        .subscribe();

    this.firebasePasswordErrorMessagesResetSubscription =
      this.loginForm.controls.password.valueChanges
        .pipe(
          tap((email) => {
            this.firebaseAuthPasswordErrorMessageSignal.set(null);
          })
        )
        .subscribe();
  }

  ngOnDestroy() {
    this.registrationSubscription?.unsubscribe();
    this.firebaseEmailErrorMessagesResetSubscription?.unsubscribe();
    this.firebasePasswordErrorMessagesResetSubscription?.unsubscribe();
  }

  isEmailOrUsernameInvalid(): boolean {
    return this.loginForm.get('email')?.invalid &&
      (this.loginForm.get('email')?.dirty ||
        this.loginForm.get('email')?.touched ||
        this.isSubmitted)
      ? true
      : false;
  }

  isPasswordInvalid(): boolean {
    return this.loginForm.get('password')?.invalid &&
      (this.loginForm.get('password')?.dirty ||
        this.loginForm.get('password')?.touched ||
        this.isSubmitted)
      ? true
      : false;
  }

  emailOrUsernameErrorMessages(): string[] {
    const errorMessages: string[] = [];

    if (this.loginForm.get('email')?.hasError('required')) {
      errorMessages.push('Email or username is required.');
    }
    return errorMessages;
  }

  passwordErrorMessages(): string[] {
    const errorMessages: string[] = [];

    if (this.loginForm.get('password')?.hasError('required')) {
      errorMessages.push('Password is required.');
    }
    return errorMessages;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    // shake the errors if user tried to submit while errors still persist
    // will need to add shake error class to the error containers
    if (this.loginForm.invalid) {
      this.shakeError = true;

      setTimeout(() => {
        this.shakeError = false;
      }, 750);
    }

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.getRawValue();
      const password = this.loginForm.get('password')?.getRawValue();

      // try to register user to auth
      this.registrationSubscription = this.firebaseAuthService
        .loginUserWithEmailAndPassword$(email, password)
        .pipe(
          tap(),
          catchError((error) => {
            // if firebase errors occured error message will be shown on the component
            if (error.name != 'FirebaseError' && !/auth/.test(error.code)) {
              return of(null);
            }

            const { errorSource, message: errorMessage } =
              this.firebaseAuthService.getFirebaseAuthErrorMessage(error.code);

            switch (errorSource) {
              case 'email-and-password':
                this.firebaseAuthEmailErrorMessageSignal.set(errorMessage);
                this.firebaseAuthPasswordErrorMessageSignal.set(errorMessage);
                this.firebaseAuthGeneralErrorMessageSignal.set(null);
                break;

              case 'email':
                this.firebaseAuthEmailErrorMessageSignal.set(errorMessage);
                this.firebaseAuthGeneralErrorMessageSignal.set(null);
                this.firebaseAuthPasswordErrorMessageSignal.set(null);
                break;

              case 'password':
                this.firebaseAuthPasswordErrorMessageSignal.set(errorMessage);
                this.firebaseAuthGeneralErrorMessageSignal.set(null);
                this.firebaseAuthEmailErrorMessageSignal.set(null);
                break;

              case 'general':
                this.firebaseAuthGeneralErrorMessageSignal.set(errorMessage);
                this.firebaseAuthPasswordErrorMessageSignal.set(null);
                this.firebaseAuthEmailErrorMessageSignal.set(null);
                break;
            }

            return of(null);
          })
        )
        .subscribe();
    }
  }

  togglePasswordVisibility() {
    if (this.passwordInputType == 'password') {
      this.passwordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
    }
  }

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
      iconPath: 'assets/icons/header/Question.svg',
      anchor: {
        urlType: 'internal',
        path: '/auth/login',
        target: '_self',
      },
    },
  ];
}
