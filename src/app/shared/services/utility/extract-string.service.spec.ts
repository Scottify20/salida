import { TestBed } from '@angular/core/testing';

import { ExtractStringService } from './extract-string.service';

describe('ExtractStringService', () => {
  let service: ExtractStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
