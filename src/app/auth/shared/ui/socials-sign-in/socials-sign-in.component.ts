import { Component, DestroyRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/auth/firebase-auth.service';
import { AsyncPipe } from '@angular/common';
import { catchError, of, take, tap } from 'rxjs';
import { ToastsService } from '../../../../shared/components/toasts/data-access/toasts.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../core/user/user.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-socials-sign-in',
  standalone: true,
  imports: [AsyncPipe],
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

          // if the account is newly created, the createdAt and lastLoginAt will have roughly the same value which will then trigger the registration of the user to firestore
          const metadata = user.metadata as any;
          // the threshold is in milliseconds if the difference between lastLoginAt and createdAt is less than or equal than the threshold, its considered as newly created
          const threshold = 10 * 1000;

          console.log(
            metadata.createdAt,
            metadata.lastLoginAt,
            metadata.lastLoginAt - metadata.createdAt,
          );

          if (metadata.lastLoginAt - metadata.createdAt <= threshold) {
            console.log('registering');
            this.registerUserToFirestore(user);
          } else {
            this.router.navigateByUrl('/');
          }

          return of(null);
        }),
        catchError((error) => {
          if (
            !error.code ||
            !/auth/.test(error.code) ||
            error.name != 'FirebaseError'
          ) {
            return of(null);
          }
          // if the getFirebaseAuthErrorMessage function returns null, return of(null) do not show any error message
          // the function returns null when the message isnt supposed to be seen by the user.
          const errorMessage =
            this.firebaseAuthService.getFirebaseAuthErrorMessage(
              error.code,
            )?.message;

          if (!errorMessage) {
            return of(null);
          }

          this.toastsService.addToast({
            text: errorMessage,
            scope: 'route',
            iconPath: 'assets/icons/toast/error.svg',
          });

          return of(null);
        }),
      )
      .subscribe();
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
        this.router.navigateByUrl('/auth/user/set-username');
      });
  }
}
