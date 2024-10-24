import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from 'firebase/auth';
import { catchError, Observable, of, retry, switchMap, take, tap } from 'rxjs';
import { UserDataInFireStore } from '../../shared/interfaces/models/user/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SalidaResponse } from '../../shared/interfaces/types/api-response/SalidaResponse';
import { FirebaseAuthService } from '../auth/firebase-auth.service';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import { authState } from '@angular/fire/auth';
import { ToastsService } from '../../shared/components/toasts/data-access/toasts.service';
import { SalidaAuthError } from '../../shared/interfaces/types/api-response/SalidaAuthError';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private firebaseAuthService: FirebaseAuthService,
    private platformCheckService: PlatformCheckService,
    private toastService: ToastsService,
  ) {
    if (this.platformCheckService.isBrowser()) {
      authState(this.firebaseAuthService.auth)
        .pipe(
          tap((user) => {
            this.userSig.set(user);
          }),
        )
        .subscribe();
    }
  }

  private baseUrlProtected = `${environment.SALIDA_API_BASE_URL}/api/v1/protected/users`;
  // private baseUrlPublic = `${environment.SALIDA_API_BASE_URL}/api/v1/public/users`;

  userSig: WritableSignal<User | null | undefined> = signal(null); // the auth state of the user

  userDisplayNameSig = computed(() => this.userSig()?.displayName);

  userEmailSig = computed(() => this.userSig()?.email);

  userPhotoUrlSig = computed(() =>
    this.userSig()?.photoURL
      ? this.userSig()?.photoURL
      : '../../../../assets/icons/home-header/User-solid.svg',
  );

  userPlainStringIdentifierSig = computed(
    () =>
      this.userDisplayNameSig() ||
      this.userEmailSig()?.split('@')[0] ||
      'My Profile',
  );

  registerUserDataToFirestore(
    user: User | null | undefined,
  ): Observable<SalidaResponse | null> {
    // checks if the user Object is not null or undefined
    if (!user) {
      this.toastService.addToast({
        text: 'An error has occured while saving your data.',
        scope: 'route',
        iconPath: 'assets/icons/toast/error.svg',
      });
      // console.log('Failed to save user to firestore, cannot read user.');
      return of(null);
    }

    // copies the user object from firebase auth
    const userCopy: { [key: string]: any } = { ...user };

    // the user object that will uploaded to firestore db
    const userToFirestore: UserDataInFireStore = {
      isAnonymous: false,
      uid: '',
      password: undefined,
      email: undefined,
      displayName: undefined,
      photoURL: undefined,
      phoneNumber: undefined,
      username: undefined,
      providerData: [],
      preferences: undefined,
      role: 'user',
      createdAt: undefined,
      lastLoginAt: undefined,
      updatedAt: undefined,
    };

    // copies all the non null/undefined valuse to userToFirestoreTemplate object
    Object.keys(userCopy).forEach((key) => {
      if (userCopy[key] !== undefined && userToFirestore.hasOwnProperty(key)) {
        userToFirestore[key] = userCopy[key];
      }
    });

    // gets the creation time and last sign in time of the user's account and also assigns it to userToFirestoreTemplate object
    const { creationTime, lastSignInTime } = user.metadata;
    if (creationTime) {
      userToFirestore.createdAt = Date.parse(creationTime).toString();
    }
    if (lastSignInTime) {
      userToFirestore.lastLoginAt = Date.parse(lastSignInTime).toString();
    }

    return this.firebaseAuthService.getAuthorizationHeadersWithUserToken().pipe(
      retry(3),
      take(1),
      switchMap((headers) => {
        if (!headers) {
          // Handle the missing token by showing a toast message
          this.toastService.addToast({
            text: 'Authorization failed. Cannot save user data.',
            scope: 'route',
            iconPath: 'assets/icons/toast/error.svg',
          });
          return of(null); // Return a null observable instead of making a request
        }

        return this.http
          .post<SalidaResponse>(this.baseUrlProtected, userToFirestore, {
            headers,
          })
          .pipe(take(1));
      }),
    );
  }

  setUsernameForUser(username: string) {
    return this.firebaseAuthService.getAuthorizationHeadersWithUserToken().pipe(
      retry(3),
      take(1),
      switchMap((headers) => {
        if (!headers) {
          // Handle the missing token by showing a toast message
          this.toastService.addToast({
            text: 'Cannot set username. Authorization failed.',
            scope: 'route',
            iconPath: 'assets/icons/toast/error.svg',
          });
          return of(null); // Return a null observable instead of making a request
        }

        return this.http
          .patch<SalidaResponse>(
            `${this.baseUrlProtected}/set-username`,
            { username: username },
            {
              headers,
            },
          )
          .pipe(
            take(1),
            catchError((err) => {
              // if error comes from not being able to connect to server
              if (err.status == 0) {
                throw new SalidaAuthError(
                  "Can't connect to server.",
                  'auth/cannot-connect-to-server',
                  'general',
                );
              }

              // if error comes from setting username
              throw new SalidaAuthError(
                err.error.message,
                err.error.code,
                err.error.source,
              );
            }),
          );
      }),
    );
  }

  // saveUserPreferencesToFireStore() {}
  getUserDataFromFireStore(idToken: string | undefined) {}
}
