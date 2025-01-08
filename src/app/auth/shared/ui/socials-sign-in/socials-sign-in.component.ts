import { Component, DestroyRef, signal } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/auth/firebase-auth.service';
import { catchError, of, take, tap } from 'rxjs';
import { ToastsService } from '../../../../shared/components/toasts/data-access/toasts.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../core/user/user.service';
import { User } from 'firebase/auth';
import { SalidaAuthError } from '../../../../shared/interfaces/types/api-response/SalidaAuthError';
import { SalidaAuthService } from '../../../../core/auth/salida-auth.service';
import {
  LoadingModalProps,
  LoadingModalComponent,
} from '../../../../shared/components/loading-modal/loading-modal.component';

@Component({
  selector: 'app-socials-sign-in',
  imports: [LoadingModalComponent],
  templateUrl: './socials-sign-in.component.html',
  styleUrl: './socials-sign-in.component.scss',
})
export class SocialsSignInComponent {
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private toastsService: ToastsService,
    private router: Router,
    private destroyRef: DestroyRef,
    private userService: UserService,
    private salidaAuthService: SalidaAuthService,
  ) {}

  loginWithGoogle() {
    this.firebaseAuthService
      .loginWithGoogle$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((user) => {
          if (!user) {
            this.toastsService.addToast({
              text: 'Failed to login with Google.',
              scope: 'route',
              iconPath: 'assets/icons/toast/error.svg',
            });

            return of(null);
          }

          this.toastsService.addToast({
            text: 'Successfully logged in with Google.',
            scope: 'route',
            iconPath: 'assets/icons/toast/success.svg',
          });

          this.attemptRegisterUserToFirestore(user);

          return of(null);
        }),
        catchError((error) => {
          this.setToastForErrorMessage(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  setToastForErrorMessage(error: any) {
    let errorMessage: string | undefined = undefined;

    if (error instanceof SalidaAuthError) {
      errorMessage =
        this.salidaAuthService.getSalidAuthErrorMessage(error).message ||
        undefined;
    }

    if (error.name === 'FirebaseError') {
      errorMessage =
        this.firebaseAuthService.getFirebaseAuthErrorMessage(error.code)
          ?.message || undefined;
    }

    if (!error.code || !/auth/.test(error.code)) {
      return;
    }
    // if the getFirebaseAuthErrorMessage function returns null, return of(null) do not show any error message
    // the function returns null when the message isnt supposed to be seen by the user.

    if (!errorMessage) {
      return;
    }

    this.toastsService.addToast({
      text: errorMessage,
      scope: 'route',
      iconPath: 'assets/icons/toast/error.svg',
    });
  }

  private attemptRegisterUserToFirestore(user: User) {
    this.registrationLoadingModalProps.config.isOpenSig.set(true);

    this.userService
      .registerUserDataToFirestore(user)
      .pipe(
        take(1),
        tap(async (response) => {
          await this.firebaseAuthService.refreshUserTokenAndClaims();

          this.registrationLoadingModalProps.config.isOpenSig.set(false);
          // Signup and register request finished, set in progress to false
          this.router.navigateByUrl('/auth/set-username');
        }),
        catchError((error: any | SalidaAuthError) => {
          this.registrationLoadingModalProps.config.isOpenSig.set(false);

          if (
            error instanceof SalidaAuthError &&
            error.code === 'auth/user-already-registered'
          ) {
            this.router.navigateByUrl('/');
            return of(null);
          }

          this.setToastForErrorMessage(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  registrationLoadingModalProps: LoadingModalProps = {
    config: {
      id: 'registration-with-socials-sign-in-loading-modal',
      isOpenSig: signal(false),
    },
    content: {
      title: 'Preparing your account.',
    },
  };
}
