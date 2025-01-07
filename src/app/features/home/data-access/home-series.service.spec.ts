import { TestBed } from '@angular/core/testing';

import { HomeSeriesService } from './home-series.service';

describe('HomeSeriesService', () => {
  let service: HomeSeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeSeriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
