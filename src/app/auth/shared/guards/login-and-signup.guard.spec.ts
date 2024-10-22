import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginAndSignupGuard } from './login-and-signup.guard';

describe('loginAndSignupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginAndSignupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
