import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { ToastsContainerComponent } from './toasts-container/feature/toasts-container.component';
import { PlatformCheckService } from './shared/services/dom/platform-check.service';

import { NavigationTabsComponent } from './shared/components/pill-tabs/navigation-tabs/navigation-tabs.component';
import { FirebaseAuthService } from './core/auth/firebase-auth.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DialogProps } from './shared/components/dialog/dialog.model';
import { RouteHistoryService } from './shared/services/navigation/route-history.service';
import { RouteScrollPositionService } from './shared/services/navigation/route-scroll-position.service';
import { PageTransitionService } from './shared/services/navigation/page-transition.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastsContainerComponent,
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
    private routeHistoryService: RouteHistoryService,
    private routeScrollPositionService: RouteScrollPositionService,
    private pageTransitionService: PageTransitionService,
  ) {}
  ngAfterViewInit() {
    if (this.platformCheckService.isBrowser()) {
      this.pageTransitionService.startPageTransitions();
    }
  }

  title = 'Salida';
}
