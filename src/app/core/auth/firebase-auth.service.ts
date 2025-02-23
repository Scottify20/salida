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
  IdTokenResult,
  ParsedToken,
} from '@angular/fire/auth';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import {
  BehaviorSubject,
  catchError,
  delay,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { SalidaAuthError } from '../../shared/interfaces/types/api-response/SalidaAuthError';
import { SalidaEmailResponse } from '../../shared/interfaces/types/api-response/SalidaEmailResponse';
import { SalidaAuthService } from './salida-auth.service';
import { HttpHeaders } from '@angular/common/http';

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
  private platformCheckService = inject(PlatformCheckService);
  private salidaAuthService = inject(SalidaAuthService);

  constructor() {
    if (this.platformCheckService.isBrowser()) {
      this.auth = inject(Auth);
    }
  }
  auth!: Auth;
  userClaimsState$ = new BehaviorSubject<ParsedToken | undefined>(undefined);

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
    return this.salidaAuthService.getUserEmailByUsername$(username).pipe(
      switchMap((response) => {
        const email = (response as SalidaEmailResponse).data?.email as string;

        // console.log(email, 'email');
        return this.loginWithEmailAndPassword$(email, password);
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

  // creates a observable of the HttpHeader with the token of the user or null
  getAuthorizationHeadersWithUserToken(): Observable<HttpHeaders | null> {
    return this.getToken().pipe(
      take(1),
      switchMap((idToken) => {
        if (!idToken) {
          return of(null);
        }
        const headers = new HttpHeaders({ Authorization: `Bearer ${idToken}` });
        return of(headers);
      }),
    );
  }

  // Forces a refresh of the token of the user
  async refreshUserTokenAndClaims() {
    const user = this.auth.currentUser;
    if (user) {
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      this.userClaimsState$.next(idTokenResult.claims);
    }
  }

  signOut(): void {
    if (this.auth) {
      this.auth.signOut();
      window.location.reload();
    }
  }

  // the function returns the message that will be shown to the user when a firebase auth error has occured
  // it returns null when the message isn't supposed to be seen by the user.
  getFirebaseAuthErrorMessage(errorCode: string): {
    errorSource: FirebaseAuthErrorSource;
    message: string;
  } | null {
    let errorSource: FirebaseAuthErrorSource = 'general';
    let message = 'Unexpected error. Try again or contact the developer.';

    switch (errorCode) {
      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        message = 'Check your internet connection and try again.';
        break;
      case AuthErrorCodes.EMAIL_EXISTS:
        message = 'Email is already in use. Please use a different email.';
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
        return null;
      case AuthErrorCodes.EXPIRED_POPUP_REQUEST:
        return null;
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        message = 'The email or password you entered in incorrect.';
        errorSource = 'emailAndPassword';
        break;
      case AuthErrorCodes.POPUP_BLOCKED:
        message = 'Please allow popups.';
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        errorSource = 'email';
        message = 'Too many failed attempts. Please try again later.';
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
