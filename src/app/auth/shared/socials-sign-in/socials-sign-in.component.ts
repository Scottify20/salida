import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UserService } from '../../../core/user/user.service';

@Component({
  selector: 'app-socials-sign-in',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './socials-sign-in.component.html',
  styleUrl: './socials-sign-in.component.scss',
})
export class SocialsSignInComponent {
  constructor(
    protected firebaseAuthService: FirebaseAuthService,
    protected userService: UserService
  ) {}
}
