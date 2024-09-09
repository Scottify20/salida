import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  AuthError,
  UserCredential,
  signInWithEmailAndPassword,
  User,
  AuthErrorCodes,
} from '@angular/fire/auth';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import { UserService } from '../user/user.service';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(
    private platformCheckService: PlatformCheckService,
    private userService: UserService
  ) {
    if (this.platformCheckService.isBrowser()) {
      this.auth = inject(Auth);
      this.userService.user$ = authState(this.auth);
      this.userService.startUserDataSubscription();
    }
  }

  private auth!: Auth;

  async getToken(): Promise<string | undefined> {
    return await this.auth.currentUser?.getIdToken(true);
  }

  loginWithGoogle$(): Observable<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      })
    );
  }

  loginWithFacebook$(): Observable<User> {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      })
    );
  }

  loginUserWithEmailAndPassword$(
    email: string,
    password: string
  ): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      })
    );
  }

  registerUserWithEmailAndPasswordToAuth$(
    email: string,
    password: string
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        throw error;
      })
    );
  }

  signOut(): void {
    if (this.auth) {
      this.auth.signOut();
    }
  }

  getFirebaseAuthErrorMessage(errorCode: string): {
    errorSource: string;
    message: string;
  } {
    let errorSource: 'general' | 'password' | 'email' | 'email-and-password' =
      'general';
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
        errorSource = 'email-and-password';
        break;
      case AuthErrorCodes.POPUP_BLOCKED:
        message = 'Please allow popups.';
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        message =
          'Too many failed attempts. Reset your password or again later';
        break;
      case AuthErrorCodes.USER_DELETED:
        message = "Couldn't find your account.";
        errorSource = 'email';
        break;
    }
    return { errorSource, message };
  }
}
