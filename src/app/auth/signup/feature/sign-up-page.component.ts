import {
  Component,
  DestroyRef,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderButton } from '../../../shared/components/header-button/header-button.component';
import { CommonModule } from '@angular/common';
import { CapsLockDetectorDirective } from '../../../shared/directives/caps-lock-detector.directive';
import { SocialsSignInComponent } from '../../shared/ui/socials-sign-in/socials-sign-in.component';
import {
  passwordValidator,
  validPasswordCharRegex,
} from '../../shared/validators/password-validator';
import { Router, RouterModule } from '@angular/router';
import {
  FirebaseAuthErrorSource,
  FirebaseAuthService,
} from '../../../core/auth/firebase-auth.service';
import {
  catchError,
  delay,
  distinctUntilChanged,
  fromEvent,
  of,
  take,
  tap,
  throttleTime,
} from 'rxjs';
import { AuthError, User } from 'firebase/auth';
import { SalidaAuthError } from '../../../shared/interfaces/types/api-response/SalidaAuthError';
import { SalidaAuthErrorSource } from '../../../shared/interfaces/types/api-response/SalidaError';
import { ToastsService } from '../../../shared/components/toasts/data-access/toasts.service';
import { SalidaAuthService } from '../../../core/auth/salida-auth.service';
import { ProgressIndicatorComponent } from '../../shared/ui/progress-indicator/progress-indicator.component';
import { ProgressIndicatorProps } from '../../shared/ui/progress-indicator/progress-indicator.model';
import { DividerWithTitleComponent } from '../../shared/ui/divider-with-title/divider-with-title.component';
import { LoadingDotsComponent } from '../../../shared/components/animated/loading-dots/loading-dots.component';
import { UserService } from '../../../core/user/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    CapsLockDetectorDirective,
    SocialsSignInComponent,
    RouterModule,
    ProgressIndicatorComponent,
    DividerWithTitleComponent,
    LoadingDotsComponent,
    HeaderButtonsComponent,
  ],
  templateUrl: '../ui/sign-up-page/sign-up-page.component.html',
  styleUrl: '../ui/sign-up-page/sign-up-page.component.scss',
})
export class SignUpPageComponent {
  constructor(
    private fb: FormBuilder,
    private firebaseAuthService: FirebaseAuthService,
    private salidaAuthService: SalidaAuthService,
    private router: Router,
    private userService: UserService,
    private toastsService: ToastsService,
    private destoryRef: DestroyRef,
  ) {}
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator()]],
  });

  @ViewChild('signupButton') signupButton!: ElementRef;

  passwordInputType: 'text' | 'password' = 'password';
  isSubmittedAtleastOnce = false;
  isSignupActionInProgress = signal<boolean>(false);

  authErrorMessagesSig = signal<SignupErrorMessages>({
    email: null,
    password: null,
  });

  isSubmitted = false;

  ngOnInit() {
    this.startAuthErrorMessageRefresher();
  }

  ngAfterViewInit() {
    this.startSignupButtonListener();
  }

  startSignupButtonListener() {
    fromEvent(this.signupButton.nativeElement, 'click')
      .pipe(
        takeUntilDestroyed(this.destoryRef),
        throttleTime(1000),
        tap(() => {
          this.onSubmit();
        }),
      )
      .subscribe();
  }

  startAuthErrorMessageRefresher() {
    this.signupForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destoryRef),
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

  onSubmit() {
    this.isSubmitted = true;

    if (this.signupForm.valid) {
      const email = this.signupForm.get('email')?.getRawValue();
      const password = this.signupForm.get('password')?.getRawValue();

      // Set signup in progress
      this.isSignupActionInProgress.set(true);

      this.firebaseAuthService
        .registerWithEmailAndPasswordToAuth$(email, password)
        .pipe(
          takeUntilDestroyed(this.destoryRef),
          tap((user) => {
            // console.log(user, user);
            this.registerUserToFirestore(user);
          }),
          catchError((error) => {
            this.setAuthErrorMessages(error);
            // Signup request finished, set in progress to false
            this.isSignupActionInProgress.set(false);
            return of(null);
          }),
        )
        .subscribe();
    }
  }

  private registerUserToFirestore(user: User) {
    this.userService
      .registerUserDataToFirestore(user)
      .pipe(take(1))
      .subscribe((response) => {
        if (!response) {
          this.toastsService.addToast({
            text: 'There was an error registering your data.',
            scope: 'route',
            iconPath: 'assets/icons/toast/error.svg',
          });
          return;
        }

        // Signup and register request finished, set in progress to false
        this.isSignupActionInProgress.set(false);

        this.router.navigateByUrl('/auth/set-username');
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
      errorSource = firebaseAuthError?.errorSource;
      errorMessage = firebaseAuthError?.message;

      // if the getFirebaseAuthErrorMessage function returns null,  return and do not show any error message
      // the function returns null when the message isnt supposed to be seen by the user.
      if (!errorSource || !errorMessage) {
        return;
      }
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
      this.isSignupActionInProgress() // Access signal value here
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

  progressIndicatorProps: ProgressIndicatorProps = {
    visitedSteps: 1,
    steps: 2,
  };

  headerButtons: HeaderButton[] = [
    {
      type: 'icon',
      iconPath: 'assets/icons/header/Back.svg',
      onClickCallbackFn: () => {
        this.router.navigateByUrl('/');
      },
    },
    // {
    //   type: 'iconWithBG',
    //   iconPath: 'assets/icons/header/Question.svg',
    //   anchor: {
    //     urlType: 'internal',
    //     path: '/auth/login',
    //     target: '_self',
    //   },
    // },
  ];
}
