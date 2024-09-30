import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsHeaderComponent } from '../../../shared/components/buttons-header/buttons-header.component';
import { HeaderButton } from '../../../shared/components/buttons-header/buttons-header.model';
import { CommonModule } from '@angular/common';
import { CapsLockDetectorDirective } from '../../../shared/directives/caps-lock-detector.directive';
import { SocialsSignInComponent } from '../../shared/socials-sign-in/socials-sign-in.component';
import {
  passwordValidator,
  validPasswordCharRegex,
} from '../../validators/password-validator';
import { Router, RouterModule } from '@angular/router';
import {
  FirebaseAuthErrorSource,
  FirebaseAuthService,
} from '../../../core/auth/firebase-auth.service';
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
import { AuthError } from 'firebase/auth';
import { SalidaAuthError } from '../../../shared/models/errors/SalidaAuthError';
import { SalidaAuthErrorSource } from '../../../shared/interfaces/types/api-response/SalidaErrors';
import { ToastsService } from '../../../toasts-container/data-access/toasts.service';
import { SalidaAuthService } from '../../../core/auth/salida-auth.service';

interface SignupErrorMessages {
  email: string | null;
  password: string | null;
  [key: string]: string | null;
}

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
  ],
  templateUrl: '../ui/sign-up-page/sign-up-page.component.html',
  styleUrl: '../ui/sign-up-page/sign-up-page.component.scss',
})
export class SignUpPageComponent {
  constructor(
    private fb: FormBuilder,
    private firebaseAuthService: FirebaseAuthService,
    private toastsService: ToastsService,
    private salidaAuthService: SalidaAuthService,
    private router: Router,
  ) {}
  @ViewChild('signupButton') signupButton!: ElementRef;

  passwordInputType: 'text' | 'password' = 'password';
  isSubmittedAtleastOnce = false;
  isSubmitActioninProgress = false;

  authErrorMessagesSig = signal<SignupErrorMessages>({
    email: null,
    password: null,
  });

  private signupFormValuesSubscription: Subscription | null = null;
  private signupButtonClickSubscription: Subscription | null = null;

  registrationSubscription: Subscription | null = null;
  isSubmitted = false;

  ngOnInit() {
    this.signupFormValuesSubscription = this.signupForm.valueChanges
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
    const firstClick$ = fromEvent(
      this.signupButton.nativeElement,
      'click',
    ).pipe(take(1));
    const subsequentClicks$ = fromEvent(
      this.signupButton.nativeElement,
      'click',
    ).pipe(skip(1), debounceTime(1000));

    this.signupButtonClickSubscription = merge(firstClick$, subsequentClicks$)
      .pipe(
        tap(() => {
          this.onSubmit();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.registrationSubscription?.unsubscribe();
    this.signupFormValuesSubscription?.unsubscribe();
    this.signupButtonClickSubscription?.unsubscribe();
  }

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator()]],
  });

  onSubmit() {
    this.isSubmitted = true;

    if (this.signupForm.valid) {
      const email = this.signupForm.get('email')?.getRawValue();
      const password = this.signupForm.get('password')?.getRawValue();
      // try to register user to auth
      this.registrationSubscription = this.firebaseAuthService
        .registerWithEmailAndPasswordToAuth$(email, password)
        .pipe(
          tap((user) => {
            this.handleSignupSuccess(user?.email);
          }),
          catchError((error) => {
            // if errors occured error message will be shown on the component
            this.setAuthErrorMessages(error);
            return of(null);
          }),
        )
        .subscribe();
    }
  }

  private handleSignupSuccess(accountIdentifier: string | null) {
    let successMessage = `Successfully created account.`;

    if (accountIdentifier) {
      successMessage = `Successfully created account with ${accountIdentifier}.`;
    }

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
      email:
        errorSource === 'email' || errorSource === 'emailAndPassword'
          ? errorMessage
          : null,
      password:
        errorSource === 'password' || errorSource === 'emailAndPassword'
          ? errorMessage
          : null,
    });
  }

  togglePasswordVisibility() {
    if (this.passwordInputType == 'password') {
      this.passwordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
    }
  }

  isSignupButtonDisabled(): boolean {
    const { password: firebasePasswordError, email: firebaseEmailError } =
      this.authErrorMessagesSig();

    return (
      this.isEmailPatternInvalid() ||
      this.isPasswordPatternInvalid() ||
      !!firebaseEmailError ||
      !!firebasePasswordError ||
      this.isSubmitActioninProgress
    );
  }

  isEmailPatternInvalid(): boolean {
    return this.signupForm.get('email')?.invalid &&
      (this.signupForm.get('email')?.dirty ||
        this.signupForm.get('email')?.touched ||
        this.isSubmitted)
      ? true
      : false;
  }

  isPasswordPatternInvalid(): boolean {
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
        : null,
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
