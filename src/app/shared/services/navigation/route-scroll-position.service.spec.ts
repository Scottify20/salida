import { TestBed } from '@angular/core/testing';

import { RouteScrollPositionService } from './route-scroll-position.service';

describe('RouteScrollPositionService', () => {
  let service: RouteScrollPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteScrollPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
