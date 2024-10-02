import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { ToastsContainerComponent } from './toasts-container/feature/toasts-container.component';
import { PlatformCheckService } from './shared/services/dom/platform-check.service';
import { CommonModule } from '@angular/common';
import { NavigationTabsComponent } from './shared/components/pill-tabs/navigation-tabs/navigation-tabs.component';
import { FirebaseAuthService } from './core/auth/firebase-auth.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DialogProps } from './shared/components/dialog/dialog.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastsContainerComponent,
    CommonModule,
    NavigationTabsComponent,
    DialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    protected platformCheckService: PlatformCheckService,
    private firebaseAuthService: FirebaseAuthService,
  ) {}
  title = 'Salida';
}
