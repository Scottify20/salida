import { TestBed } from '@angular/core/testing';

import { TmdbConfigService } from './tmdb-config.service';

describe('TmdbConfigService', () => {
  let service: TmdbConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
