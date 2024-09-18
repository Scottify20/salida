import { Component, signal } from '@angular/core';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UserService } from '../../../core/user/user.service';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { ToastsService } from '../../../toasts-container/data-access/toasts.service';

@Component({
  selector: 'app-socials-sign-in',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './socials-sign-in.component.html',
  styleUrl: './socials-sign-in.component.scss',
})
export class SocialsSignInComponent {
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private toastsService: ToastsService
  ) {}

  socialLoginSubscription: Subscription | null = null;

  loginWithGoogle() {
    this.socialLoginSubscription = this.firebaseAuthService
      .loginWithGoogle$()
      .pipe(
        tap((user) => {
          if (!user) {
            this.toastsService.addToast({
              text: 'Failed to login with Google.',
              scope: 'route',
              duration: 8000,
              iconPath: 'assets/icons/toast/error.svg',
            });

            return of(null);
          }

          const email = user.email;
          const successMessage = email
            ? `Succesfully logged in with ${email}.`
            : `Logged in with Google successfully.`;

          this.toastsService.addToast({
            text: successMessage,
            scope: 'route',
            duration: 8000,
            iconPath: 'assets/icons/toast/success.svg',
            actionButton: {
              type: 'success',
              callback: () => {
                console.log('success login toast');
              },
              label: 'Proceed',
            },
          });

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

          const errorMessage =
            this.firebaseAuthService.getFirebaseAuthErrorMessage(
              error.code
            ).message;

          this.toastsService.addToast({
            text: errorMessage,
            scope: 'route',
            duration: 8000,
            iconPath: 'assets/icons/toast/error.svg',
          });

          return of(null);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.socialLoginSubscription?.unsubscribe();
  }
}
