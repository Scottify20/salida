import { TestBed } from '@angular/core/testing';

import { ScrollPositionServiceService } from './scroll-position-service.service';

describe('ScrollPositionServiceService', () => {
  let service: ScrollPositionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPositionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
