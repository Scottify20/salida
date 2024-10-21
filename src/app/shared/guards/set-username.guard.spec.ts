import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { setUsernameGuard } from './set-username.guard';

describe('setUsernameGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => setUsernameGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
