import { TestBed } from '@angular/core/testing';

import { TemporaryUserPreferencesService } from './temporary-user-preferences-service';

describe('TemporaryUserPreferencesService', () => {
  let service: TemporaryUserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryUserPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
