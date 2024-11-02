import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PlatformCheckService } from '../../../shared/services/dom/platform-check.service';
import { UserService } from '../../../core/user/user.service';
import { delay, map, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const setUsernameGuard: CanActivateFn = () => {
  const platformCheckService = inject(PlatformCheckService);
  const userService = inject(UserService);

  if (platformCheckService.isBrowser()) {
    // Use toObservable to get an observable that emits whenever the signal changes
    return toObservable(userService.userUsernameSig).pipe(
      map((username) => {
        console.log('Username in guard:', username); // Keep this for debugging
        return !username; // Invert for guard logic
      }),
    );
  } else {
    const user = userService.userSig();
    return of(!user); // SSR handling
  }
};
