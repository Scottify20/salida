import { TestBed } from '@angular/core/testing';

import { SearchAndDiscoverService } from './search-and-discover.service';

describe('SearchAndDiscoverService', () => {
  let service: SearchAndDiscoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchAndDiscoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
