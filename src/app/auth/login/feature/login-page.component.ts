import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsHeaderComponent } from '../../../shared/components/buttons-header/buttons-header.component';
import { HeaderButton } from '../../../shared/components/buttons-header/buttons-header.model';
import { CapsLockDetectorDirective } from '../../../shared/directives/caps-lock-detector.directive';
import { SocialsSignInComponent } from '../../shared/socials-sign-in/socials-sign-in.component';
import { Router, RouterModule } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  merge,
  of,
  skip,
  Subscription,
  take,
  tap,
} from 'rxjs';
import {
  FirebaseAuthErrorSource,
  FirebaseAuthService,
} from '../../../core/auth/firebase-auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { AuthError } from 'firebase/auth';
import { SalidaAuthError } from '../../../shared/models/errors/SalidaAuthError';
import { SalidaAuthErrorSource } from '../../../shared/interfaces/types/api-response/SalidaErrors';
import { SalidaAuthService } from '../../../core/auth/salida-auth.service';
import { ToastsService } from '../../../toasts-container/data-access/toasts.service';
import { LoadingDotsComponent } from '../../../shared/components/animated/loading-dots/loading-dots.component';

interface LoginErrorMessages {
  emailOrUsername: string | null;
  password: string | null;
  [key: string]: string | null;
}

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
    LoadingDotsComponent,
  ],
  templateUrl: '../ui/login-page/login-page.component.html',
  styleUrl: '../ui/login-page/login-page.component.scss',
})
export class LoginPageComponent {
  constructor(
    private fb: FormBuilder,
    private firebaseAuthService: FirebaseAuthService,
    private salidaAuthService: SalidaAuthService,
    private toastsService: ToastsService,
    private router: Router,
  ) {}

  @ViewChild('loginButton') loginButton!: ElementRef;

  passwordInputType: 'text' | 'password' = 'password';
  isSubmittedAtleastOnce = false;
  isLoginActioninProgress = false;

  authErrorMessagesSig = signal<LoginErrorMessages>({
    emailOrUsername: null,
    password: null,
    // general: null,
  });

  private firebaseLoginSubscription: Subscription | null = null;
  private loginFormValuesSubscription: Subscription | null = null;
  private loginButtonClickSubscription: Subscription | null = null;

  loginForm = this.fb.group({
    emailOrUsername: ['', { validators: [Validators.required] }],
    password: ['', { validators: [Validators.required] }],
  });
  // loginForm = this.fb.group({
  //   email: ['', [Validators.required]],
  //   password: ['', [Validators.required]],
  //   keepLoggedIn: [false],
  // });

  ngOnInit(): void {
    this.loginFormValuesSubscription = this.loginForm.valueChanges
      .pipe(
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        tap((changedValues) => {
          const updatedErrors = { ...this.authErrorMessagesSig() };
          for (const key in changedValues) {
            updatedErrors[key] = null;
          }
          this.authErrorMessagesSig.set(updatedErrors);
        }),
      )
      .subscribe();
  }

  ngAfterViewInit() {
    const firstClick$ = fromEvent(this.loginButton.nativeElement, 'click').pipe(
      take(1),
    );
    const subsequentClicks$ = fromEvent(
      this.loginButton.nativeElement,
      'click',
    ).pipe(skip(1), debounceTime(1000));

    this.loginButtonClickSubscription = merge(firstClick$, subsequentClicks$)
      .pipe(
        tap(() => {
          this.onSubmit();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.firebaseLoginSubscription?.unsubscribe();
    this.loginFormValuesSubscription?.unsubscribe();
    this.loginButtonClickSubscription?.unsubscribe();
  }

  isEmailOrUsernamePatternInvalid(): boolean {
    const control = this.loginForm.get('emailOrUsername');
    return (
      !!control &&
      control.invalid &&
      (control.dirty || control.touched || this.isSubmittedAtleastOnce)
    );
  }

  isPasswordPatternInvalid(): boolean {
    const control = this.loginForm.get('password');
    return (
      !!control &&
      control.invalid &&
      (control.dirty || control.touched || this.isSubmittedAtleastOnce)
    );
  }

  isLoginButtonDisabled(): boolean {
    const { password: firebasePasswordError, email: firebaseEmailError } =
      this.authErrorMessagesSig();

    return (
      this.isEmailOrUsernamePatternInvalid() ||
      this.isPasswordPatternInvalid() ||
      !!firebaseEmailError ||
      !!firebasePasswordError ||
      this.isLoginActioninProgress
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
      this.isPasswordPatternInvalid() &&
      this.loginForm.get('password')?.hasError('required')
    ) {
      errorMessages.push('Password is required.');
    }
    return errorMessages;
  }

  private onSubmit(): void {
    this.isSubmittedAtleastOnce = true;

    if (!this.loginForm.valid) {
      return;
    }

    const emailOrUsername = this.loginForm
      .get('emailOrUsername')
      ?.getRawValue();
    const password = this.loginForm.get('password')?.getRawValue();

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRegex.test(emailOrUsername)) {
      this.loginWithEmailAndPassword(emailOrUsername, password);
      return;
    }

    this.loginWithUsernameAndPassword(emailOrUsername, password);
  }

  private loginWithEmailAndPassword(email: string, password: string) {
    this.isLoginActioninProgress = true;

    this.firebaseLoginSubscription = this.firebaseAuthService
      .loginWithEmailAndPassword$(email, password)
      .pipe(
        tap((user) => {
          this.handleLoginSuccess(user?.email || 'your account');
        }),
        catchError((error) => {
          this.setAuthErrorMessages(error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.isLoginActioninProgress = false;
      });
  }

  private loginWithUsernameAndPassword(username: string, password: string) {
    this.isLoginActioninProgress = true;

    this.firebaseLoginSubscription = this.firebaseAuthService
      .loginWithUsernameAndPassword$(username, password)
      .pipe(
        tap((user) => {
          this.handleLoginSuccess(user?.email || 'your account');
        }),
        catchError((error) => {
          this.setAuthErrorMessages(error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.isLoginActioninProgress = false;
      });
  }

  private handleLoginSuccess(accountIdentifier: string) {
    const successMessage = `Successfully logged in with ${accountIdentifier}.`;
    this.toastsService.addToast({
      text: successMessage,
      scope: 'route',
      duration: 8000,
      iconPath: 'assets/icons/toast/success.svg',
      actionButton: {
        type: 'success',
        callback: () => {
          this.router.navigateByUrl('/');
        },
        label: 'Proceed',
      },
    });
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
      errorSource = firebaseAuthError.errorSource;
      errorMessage = firebaseAuthError.message;
    }

    if (!errorSource || !errorMessage) {
      this.authErrorMessagesSig.set({
        ...this.authErrorMessagesSig(),
        general: 'An unexpected error has occurred.',
      });
      return;
    }

    if (errorSource == 'general') {
      this.toastsService.addToast({
        iconPath: '/assets/icons/toast/error.svg',
        text: errorMessage,
        scope: 'route',
        duration: 0,
      });
    }

    this.authErrorMessagesSig.set({
      emailOrUsername:
        errorSource === 'email' ||
        errorSource === 'username' ||
        errorSource === 'emailAndPassword'
          ? errorMessage
          : null,
      password:
        errorSource === 'password' || errorSource === 'emailAndPassword'
          ? errorMessage
          : null,
    });
  }

  togglePasswordVisibility(): void {
    this.passwordInputType =
      this.passwordInputType === 'password' ? 'text' : 'password';
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
