import { CanActivateFn } from '@angular/router';

export const setUsernameGuard: CanActivateFn = (route, state) => {
  return true;
};
