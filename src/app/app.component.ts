import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { ToastsContainerComponent } from './shared/components/toasts/feature/toasts-container.component';
import { PlatformCheckService } from './shared/services/dom/platform-check.service';

import { FirebaseAuthService } from './core/auth/firebase-auth.service';
import { PageTransitionService } from './core/routing/page-transition.service';
import { RouteHistoryService } from './core/routing/route-history.service';
import { UserService } from './core/user/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastsContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected platformCheckService = inject(PlatformCheckService);
  private firebaseAuthService = inject(FirebaseAuthService);
  private routeHistoryService = inject(RouteHistoryService);
  private pageTransitionService = inject(PageTransitionService);
  private userService = inject(UserService);

  ngAfterViewInit() {
    if (this.platformCheckService.isBrowser()) {
      this.routeHistoryService.startSavingAndInterceptingRoutes();
      this.pageTransitionService.startPageTransitions();
    }
  }
  title = 'Salida';
}
