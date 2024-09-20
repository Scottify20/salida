import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { catchError, debounceTime, map, Observable, take, tap } from 'rxjs';
import { UserInFireStore } from '../../shared/interfaces/models/user/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SalidaEmailsResponse } from '../../shared/interfaces/types/api-response/SalidaEmailsResponse';
import { SalidaResponse } from '../../shared/interfaces/types/api-response/SalidaResponse';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  user$: Observable<User | null> | undefined = undefined;
  user: User | null | undefined = undefined;

  private baseUrlProtected = `${environment.SALIDA_API_BASE_URL}/api/v1/protected/users`;
  private baseUrlPublic = `${environment.SALIDA_API_BASE_URL}/api/v1/public/users`;

  saveUserInfoResponse: SalidaResponse | undefined = undefined;

  async registerUserInfoToFirestore(
    user: User | null | undefined,
    idToken: string | undefined
  ) {
    if (!user || !idToken) {
      return;
    }
    const userCopy: { [key: string]: any } = { ...user };

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

    Object.keys(userToFirestore).forEach((key) => {
      if (userCopy[key]) {
        userToFirestore[key] = userCopy[key];
      }
    });

    const { creationTime, lastSignInTime } = user.metadata;

    if (creationTime) {
      userToFirestore.createdAt = Date.parse(creationTime).toString();
    }
    if (lastSignInTime) {
      userToFirestore.lastLoginAt = Date.parse(lastSignInTime).toString();
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${idToken}` });

    this.http
      .post<SalidaResponse>(
        `${this.baseUrlProtected}/make-permanent`,
        userToFirestore,
        { headers }
      )
      .pipe(
        tap((response) => {
          this.saveUserInfoResponse = response;
        }),
        take(1)
      )
      .subscribe();
  }

  saveUserPreferencesToFireStore() {}

  startUserDataSubscription() {
    if (this.user$) {
      this.user$
        .pipe(
          tap(async (user) => {
            if (!user) {
              return;
            }
            // console.log(user);

            // if (!user.emailVerified) {
            //   await sendEmailVerification(user);
            // }
          })
        )
        .subscribe();
    }
  }

  getUserEmailsByUsername$(username: string): Observable<SalidaEmailsResponse> {
    return this.http
      .get<SalidaEmailsResponse>(`${this.baseUrlPublic}/${username}/emails`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          // console.log(error);
          throw error;
        })
      );
  }

  // getUserDataFromFireStoreWith
}

// interface SalidaApiResponse {
//   message: string;
//   data?: any;
// }

// interface UserRegistrationResponse extends SalidaApiResponse {
//   message: string;
// }

// interface GetEmailByUsernameResponse extends SalidaApiResponse {
//   message: string;
//   data?: string[];
// }
