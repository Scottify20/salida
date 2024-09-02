import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../core/auth/firebase-auth.service';
import { Subscription, tap } from 'rxjs';
import { UserCredential } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'app-login-sign-up-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-sign-up-page.component.html',
  styleUrl: './login-sign-up-page.component.scss',
})
export class LoginSignUpPageComponent {
  constructor(
    public userService: UserService,
    private firebaseAuthService: FirebaseAuthService
  ) {}
  // private userCredentialsSubscription: Subscription | null = null;
  // userCredentials: UserCredential | null | undefined = undefined;

  ngOnDestroy() {
    // this.userCredentialsSubscription?.unsubscribe();
  }

  errorMessage: string | null = null;

  onSignInWithGoogleClick() {
    this.firebaseAuthService.loginWithGoogle();
  }

  onSignOutClick() {
    this.firebaseAuthService.signOut();
  }
}
