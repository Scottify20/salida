import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { Observable, Subscription, take, tap } from 'rxjs';
import { UserInFireStore } from '../../shared/interfaces/user/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseAuthService } from '../auth/firebase-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  user$: Observable<User | null> | undefined = undefined;
  user: User | null | undefined = undefined;

  private baseUrl = 'http://localhost:3000/api/v1/users';

  saveUserInfoResponse: UserRegistrationResponse | undefined = undefined;

  async registerUserInfoToFirestore(
    user: User | null | undefined,
    idToken: string | undefined
  ) {
    if (!user || !idToken) {
      return;
    }
    const userCopy: { [key: string]: any } = { ...user };

    const userToFirestore: UserInFireStore = {
      uid: '',
      password: undefined,
      email: undefined,
      displayName: undefined,
      photoURL: undefined,
      phoneNumber: undefined,
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
      .post<UserRegistrationResponse>(
        `${this.baseUrl}/register`,
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
          tap((user) => {
            if (!user) {
              return;
            }
            console.log(user);
          })
        )
        .subscribe();
    }
  }
}

interface UserRegistrationResponse {
  message: string;
}
