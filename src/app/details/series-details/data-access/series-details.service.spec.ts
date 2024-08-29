import { TestBed } from '@angular/core/testing';

import { SeriesDetailsService } from './series-details.service';

describe('SeriesDetailsService', () => {
  let service: SeriesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
