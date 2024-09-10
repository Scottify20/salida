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
import { catchError, distinctUntilChanged, of, Subscription, tap } from 'rxjs';
import {
  FirebaseAuthErrors,
  FirebaseAuthService,
} from '../../../core/auth/firebase-auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AuthError } from 'firebase/auth';

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
    DialogComponent,
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

  isSubmittedAtleastOnce = false;
  shakeError = false;

  firebaseAuthErrorMessagesSignal = signal<FirebaseAuthErrors>({
    email: null,
    password: null,
    general: null,
  });

  firebaseLoginSubscription: Subscription | null = null;
  loginFormValuesSubscription: Subscription | null = null;

  loginForm = this.fb.group({
    emailOrUsername: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  // loginForm = this.fb.group({
  //   email: ['', [Validators.required]],
  //   password: ['', [Validators.required]],
  //   keepLoggedIn: [false],
  // });

  ngAfterViewInit() {
    this.loginFormValuesSubscription = this.loginForm.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        tap((changedValues) => {
          const currentErrors = Object(this.firebaseAuthErrorMessagesSignal());
          console.log(currentErrors);

          const updatedErrors = Object.assign({}, currentErrors) as {
            [key: string]: string | null;
          };
          for (const key in changedValues) {
            if (key === 'emailOrUsername') {
              updatedErrors['email'] = null;
            } else {
              updatedErrors[key] = null;
            }
          }

          this.firebaseAuthErrorMessagesSignal.set(updatedErrors);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.firebaseLoginSubscription?.unsubscribe();
    this.loginFormValuesSubscription?.unsubscribe();
  }

  isEmailOrUsernamePatternInvalid(): boolean {
    return this.loginForm.get('emailOrUsername')?.invalid &&
      (this.loginForm.get('emailOrUsername')?.dirty ||
        this.loginForm.get('emailOrUsername')?.touched ||
        this.isSubmittedAtleastOnce)
      ? true
      : false;
  }

  isPasswordPatternInvalid(): boolean {
    return this.loginForm.get('password')?.invalid &&
      (this.loginForm.get('password')?.dirty ||
        this.loginForm.get('password')?.touched ||
        this.isSubmittedAtleastOnce)
      ? true
      : false;
  }

  isLoginButtonDisabled(): boolean {
    const { password: firebasePasswordError, email: firebaseEmailError } =
      this.firebaseAuthErrorMessagesSignal();

    return (
      this.isEmailOrUsernamePatternInvalid() ||
      this.isPasswordPatternInvalid() ||
      !!firebaseEmailError ||
      !!firebasePasswordError
    );
  }

  emailOrUsernameErrorMessages(): string[] {
    const errorMessages: string[] = [];

    if (
      this.loginForm.get('emailOrUsername')?.hasError('required') &&
      this.isEmailOrUsernamePatternInvalid()
    ) {
      errorMessages.push('Email or username is required.');
    }
    return errorMessages;
  }

  passwordErrorMessages(): string[] {
    const errorMessages: string[] = [];

    if (
      this.loginForm.get('password')?.hasError('required') &&
      this.isPasswordPatternInvalid()
    ) {
      errorMessages.push('Password is required.');
    }
    return errorMessages;
  }

  onSubmit(): void {
    this.isSubmittedAtleastOnce = true;
    // shake the errors if user tried to submit while errors still persist
    // will need to add shake error class to the error containers

    if (this.loginForm.valid) {
      const email = this.loginForm.get('emailOrUsername')?.getRawValue();
      const password = this.loginForm.get('password')?.getRawValue();
      this.loginWithEmailAndPassword(email, password);
    }
  }

  loginWithEmailAndPassword(email: string, password: string) {
    // try to register user to auth
    this.firebaseLoginSubscription = this.firebaseAuthService
      .loginUserWithEmailAndPassword$(email, password)
      .pipe(
        tap(),
        catchError((error) => {
          // if firebase errors occured error message will be shown on the component
          if (error.name != 'FirebaseError' && !/auth/.test(error.code)) {
            return of(null);
          }

          this.setFirebaseAuthErrorMessages(error);
          return of(null);
        })
      )
      .subscribe();
  }

  loginWithUsernameAndPassword(email: string, password: string) {}

  setFirebaseAuthErrorMessages(error: AuthError) {
    const { errorSource, message: errorMessage } =
      this.firebaseAuthService.getFirebaseAuthErrorMessage(error.code);

    const nullErrorMessages: FirebaseAuthErrors = {
      email: null,
      password: null,
      general: null,
    };

    switch (errorSource) {
      case 'emailAndPassword':
        this.firebaseAuthErrorMessagesSignal.set({
          ...nullErrorMessages,
          email: errorMessage,
          password: errorMessage,
        });
        break;

      case 'email':
        this.firebaseAuthErrorMessagesSignal.set({
          ...nullErrorMessages,
          email: errorMessage,
        });
        break;

      case 'password':
        this.firebaseAuthErrorMessagesSignal.set({
          ...nullErrorMessages,
          password: errorMessage,
        });
        break;

      case 'general':
        this.firebaseAuthErrorMessagesSignal.set({
          ...nullErrorMessages,
          general: errorMessage,
        });
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
