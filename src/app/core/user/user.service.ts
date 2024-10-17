import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from 'firebase/auth';
import { Observable, of, take, tap } from 'rxjs';
import { UserInFireStore } from '../../shared/interfaces/models/user/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SalidaResponse } from '../../shared/interfaces/types/api-response/SalidaResponse';
import { FirebaseAuthService } from '../auth/firebase-auth.service';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import { authState } from '@angular/fire/auth';
import { ToastsService } from '../../toasts-container/data-access/toasts.service';

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
      this.userEmailSig()?.split('@')[0] ||
      this.userDisplayNameSig() ||
      'My Profile',
  );

  private baseUrlProtected = `${environment.SALIDA_API_BASE_URL}/api/v1/protected/users`;
  // private baseUrlPublic = `${environment.SALIDA_API_BASE_URL}/api/v1/public/users`;

  registerUserInfoToFirestore(
    user: User | null | undefined,
  ): Observable<SalidaResponse | null> {
    // get the JWT token of the user's UID
    let idToken: string | undefined;
    this.firebaseAuthService
      .getToken()
      .pipe(take(1))
      .subscribe((token) => (idToken = token));

    if (!user || !idToken) {
      this.toastService.addToast({
        text: 'An error has occured while saving your data.',
        scope: 'route',
        iconPath: 'assets/icons/toast/error.svg',
      });
      console.log(
        'Failed to save user to firestore, cannot read user or userToken',
      );
      return of(null);
    }

    // copies the user object from firebase auth
    const userCopy: { [key: string]: any } = { ...user };

    // the user object that will uploaded to firestore db
    const userToFirestore: UserInFireStore = {
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

    // copies all the non null/undefined valuse to userToFirestore object
    Object.keys(userToFirestore).forEach((key) => {
      if (userCopy[key]) {
        userToFirestore[key] = userCopy[key];
      }
    });

    // gets the creation time and last sign in time of the user's account and also assigns it to userToFirestore object
    const { creationTime, lastSignInTime } = user.metadata;

    if (creationTime) {
      userToFirestore.createdAt = Date.parse(creationTime).toString();
    }
    if (lastSignInTime) {
      userToFirestore.lastLoginAt = Date.parse(lastSignInTime).toString();
    }

    // sets the request headers's Authorization with the JWT token of the userId
    const headers = new HttpHeaders({ Authorization: `Bearer ${idToken}` });

    return this.http
      .post<SalidaResponse>(
        `${this.baseUrlProtected}/make-permanent`,
        userToFirestore,
        { headers },
      )
      .pipe(take(1));
  }

  setUsernameForUser(idToken: string | undefined, username: string) {}

  // saveUserPreferencesToFireStore() {}
  getUserDataFromFireStore(idToken: string | undefined) {}
}
