import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonsHeaderComponent,
  HeaderButton,
} from '../../../shared/components/buttons-header/buttons-header.component';
import { CommonModule } from '@angular/common';
import { CapsLockDetectorDirective } from '../../../shared/directives/caps-lock-detector.directive';
import { SocialsSignInComponent } from '../../shared/socials-sign-in/socials-sign-in.component';
import {
  passwordValidator,
  validPasswordCharRegex,
} from '../../validators/password-validator';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';
import { BehaviorSubject, catchError, of, Subscription, tap } from 'rxjs';
import { AuthError, AuthErrorCodes } from 'firebase/auth';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-sign-up-page',
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
  templateUrl: '../ui/sign-up-page/sign-up-page.component.html',
  styleUrl: '../ui/sign-up-page/sign-up-page.component.scss',
})
export class SignUpPageComponent {
  constructor(
    private fb: FormBuilder,
    private firebaseAuthService: FirebaseAuthService
  ) {}
  firebaseAuthGeneralErrorMessageSignal = signal<null | string>(null);
  firebaseAuthEmailErrorMessageSignal = signal<null | string>(null);
  firebaseAuthPasswordErrorMessageSignal = signal<null | string>(null);

  firebaseEmailErrorMessagesResetSubscription: Subscription | null = null;
  firebasePasswordErrorMessagesResetSubscription: Subscription | null = null;

  registrationSubscription: Subscription | null = null;

  isSubmitted = false;
  shakeError = false;
  passwordInputType: 'text' | 'password' = 'password';

  ngAfterViewInit() {
    this.firebaseEmailErrorMessagesResetSubscription =
      this.signupForm.controls.email.valueChanges
        .pipe(
          tap((email) => {
            this.firebaseAuthEmailErrorMessageSignal.set(null);
          })
        )
        .subscribe();

    this.firebasePasswordErrorMessagesResetSubscription =
      this.signupForm.controls.password.valueChanges
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

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator()]],
  });

  onSubmit() {
    this.isSubmitted = true;

    // shake the errors if user tried to submit while errors still persist
    if (this.signupForm.invalid) {
      this.shakeError = true;

      setTimeout(() => {
        this.shakeError = false;
      }, 750);
    }

    if (this.signupForm.valid) {
      const email = this.signupForm.get('email')?.getRawValue();
      const password = this.signupForm.get('password')?.getRawValue();
      // try to register user to auth
      this.registrationSubscription = this.firebaseAuthService
        .registerUserWithEmailAndPasswordToAuth$(email, password)
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
              case 'emailAndPassword':
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

  isEmailInvalid(): boolean {
    return this.signupForm.get('email')?.invalid &&
      (this.signupForm.get('email')?.dirty ||
        this.signupForm.get('email')?.touched ||
        this.isSubmitted)
      ? true
      : false;
  }

  isPasswordInvalid(): boolean {
    return this.signupForm.get('password')?.invalid &&
      (this.signupForm.get('password')?.dirty ||
        this.signupForm.get('password')?.touched ||
        this.isSubmitted)
      ? true
      : false;
  }

  emailErrorMessages(): string[] {
    const errorMessages: string[] = [];

    if (this.signupForm.get('email')?.hasError('required')) {
      errorMessages.push('Email is required.');
    }

    if (
      this.signupForm.get('email')?.invalid &&
      !this.signupForm.get('email')?.hasError('required')
    ) {
      errorMessages.push('Please enter a valid email.');
    }

    return errorMessages;
  }

  passwordErrorMessages(): (string | null)[] {
    const errorMessages: (string | null)[] = [];

    const passwordErrors =
      this.signupForm.controls.password.errors?.['invalidPassword'];

    if (this.signupForm.get('password')?.hasError('required')) {
      errorMessages.push('Password is required.');
      return errorMessages;
    }

    if (!passwordErrors) {
      return errorMessages;
    }

    if (passwordErrors.minLength || passwordErrors.maxLength) {
      errorMessages.push('Password must be 8 to 20 characters long.');
      return errorMessages;
    }

    errorMessages.push(
      passwordErrors.missingLowercase
        ? 'Must have at least 1 lowercase letter.'
        : null,
      passwordErrors.missingUppercase
        ? 'Must have at least 1 uppercase letter.'
        : null,
      passwordErrors.containsWhitespace ? 'Spaces not allowed.' : null,
      passwordErrors.invalidCharacter
        ? 'Some characters are not allowed.'
        : null
    );

    return errorMessages;
  }

  passwordValidCharactersCheck(): { char: string; invalid: boolean }[] {
    const rawPassword = this.signupForm.get('password')?.getRawValue() || '';

    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

    const segments = segmenter.segment(rawPassword);

    const characters = Array.from(segments).map((segment) => segment.segment);

    return characters.map((char) => {
      return this.passwordInputType === 'password'
        ? { char: '•', invalid: false }
        : validPasswordCharRegex.test(char)
        ? { char: char, invalid: false }
        : { char: char, invalid: true };
    });
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
