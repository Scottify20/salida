import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';
import { PlatformCheckService } from '../../../shared/services/dom/platform-check.service';
import { authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; // Import Observable

export const loginAndSignupGuard: CanActivateFn = (): Observable<boolean> => {
  // Specify return type
  const router = inject(Router);
  const firebaseAuthService = inject(FirebaseAuthService);
  const platformCheckService = inject(PlatformCheckService);

  if (platformCheckService.isBrowser()) {
    return authState(firebaseAuthService.auth).pipe(
      map((user) => {
        if (user) {
          router.navigateByUrl('/');
          return false;
        } else {
          return true; // Allow navigation if not authenticated
        }
      }),
    );
  } else {
    return new Observable<boolean>((observer) => observer.next(false)); // Handle non-browser case
  }
};
