import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { NgIf } from '@angular/common';
import { routes } from './app.routes';
import { FirebaseAuthService } from './core/auth/firebase-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Salida';
  constructor(private firebaseAuthService: FirebaseAuthService) {}
}
