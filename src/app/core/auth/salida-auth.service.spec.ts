import { TestBed } from '@angular/core/testing';

import { SalidaAuthService } from './salida-auth.service';

describe('SalidaAuthService', () => {
  let service: SalidaAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalidaAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
