import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { ToastsContainerComponent } from './shared/components/toasts/feature/toasts-container.component';
import { PlatformCheckService } from './shared/services/dom/platform-check.service';

import { FirebaseAuthService } from './core/auth/firebase-auth.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { PageTransitionService } from './core/routing/page-transition.service';
import { RouteHistoryService } from './core/routing/route-history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastsContainerComponent,
    DialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    protected platformCheckService: PlatformCheckService,
    private firebaseAuthService: FirebaseAuthService,
    private routeHistoryService: RouteHistoryService,
    private pageTransitionService: PageTransitionService,
  ) {}

  ngAfterViewInit() {
    if (this.platformCheckService.isBrowser()) {
      this.routeHistoryService.startSavingAndInterceptingRoutes();
      this.pageTransitionService.startPageTransitions();
    }
  }
  title = 'Salida';
}
