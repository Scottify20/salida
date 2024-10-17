import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  AuthErrorCodes,
} from '@angular/fire/auth';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { SalidaAuthError } from '../../shared/models/errors/SalidaAuthError';
import { SalidaEmailsResponse } from '../../shared/interfaces/types/api-response/SalidaEmailsResponse';
import { SalidaAuthService } from './salida-auth.service';

export type FirebaseAuthErrorSource =
  | 'general'
  | 'password'
  | 'email'
  | 'emailAndPassword';

export type FirebaseAuthErrors = {
  [key in FirebaseAuthErrorSource]?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(
    private platformCheckService: PlatformCheckService,
    private salidaAuthService: SalidaAuthService,
  ) {
    if (this.platformCheckService.isBrowser()) {
      this.auth = inject(Auth);
    }
  }
  auth!: Auth;

  // gets the the JWT token for the user's UID
  getToken(): Observable<string | undefined> {
    if (!this.auth.currentUser) {
      return of(undefined);
    }
    return from(this.auth.currentUser.getIdToken(true));
  }

  loginWithGoogle$(): Observable<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      }),
    );
  }

  loginWithFacebook$(): Observable<User> {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      }),
    );
  }

  loginWithEmailAndPassword$(
    email: string,
    password: string,
  ): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      }),
    );
  }

  loginWithUsernameAndPassword$(
    username: string,
    password: string,
  ): Observable<User> {
    return this.salidaAuthService.getUserEmailsByUsername$(username).pipe(
      switchMap((response) => {
        const emails = (response as SalidaEmailsResponse).data
          ?.emails[0] as string;

        return this.loginWithEmailAndPassword$(emails, password);
      }),
      catchError((err) => {
        if (err.name === 'FirebaseError') {
          throw err;
        }

        if (err.status == 0) {
          throw new SalidaAuthError(
            "Can't connect to server.",
            'auth/cannot-connect-to-server',
            'general',
          );
        }

        // if error comes from fetching user's emails
        throw new SalidaAuthError(
          err.error.message,
          err.error.code,
          err.error.source,
        );
      }),
    );
  }

  registerWithEmailAndPasswordToAuth$(
    email: string,
    password: string,
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      }),
    );
  }

  signOut(): void {
    if (this.auth) {
      this.auth.signOut();
      window.location.reload();
    }
  }

  getFirebaseAuthErrorMessage(errorCode: string): {
    errorSource: FirebaseAuthErrorSource;
    message: string;
  } {
    let errorSource: FirebaseAuthErrorSource = 'general';
    let message = 'Unexpected error. Try again or contact the developer.';

    switch (errorCode) {
      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        message = 'Check your internet connection and try again.';
        break;
      case AuthErrorCodes.EMAIL_EXISTS:
        message = 'Email is already in use. Please use a different email';
        errorSource = 'email';
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        message = 'Password is too weak.';
        errorSource = 'password';
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        message = 'Please enter a valid email.';
        errorSource = 'email';
        break;
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        message = 'Please allow popups.';
        break;
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        message = 'The email or password you entered in incorrect.';
        errorSource = 'emailAndPassword';
        break;
      case AuthErrorCodes.POPUP_BLOCKED:
        message = 'Please allow popups.';
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        errorSource = 'email';
        message = 'Too many failed attempts. Please try again later';
        break;
      case AuthErrorCodes.USER_DELETED:
        message = "Couldn't find your account.";
        errorSource = 'email';
        break;
      case AuthErrorCodes.INTERNAL_ERROR:
        message =
          'An internal error has occured. Check your internet connection or contact the developer.';
    }
    return { errorSource, message };
  }
}
