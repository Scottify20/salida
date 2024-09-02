import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { PlatformCheckService } from '../../shared/services/dom/platform-check.service';
import { UserService } from '../user/user.service';

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

  auth!: Auth;

  async getToken(): Promise<string | undefined> {
    return await this.auth.currentUser?.getIdToken(true);
  }

  async loginWithGoogle(): Promise<void> {
    if (this.auth) {
      // Check if auth is initialized
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      signInWithPopup(this.auth, provider)
        .then(async (userCredential) => {
          if (
            !userCredential.user.isAnonymous &&
            userCredential.operationType == 'signIn'
          ) {
            const idToken = await this.getToken();
            this.userService.registerUserInfoToFirestore(
              userCredential.user,
              idToken
            );
          }
        })
        .catch((err) => {
          // throw an error if google sign in popup is not working
          console.log(err.code);
        });
    } else {
      console.log('Auth service not available on the server');
      // must throw an error or show error on ui (there was problem signing in with google)
    }
  }

  signOut(): void {
    if (this.auth) {
      this.auth.signOut();
    }
  }
}
