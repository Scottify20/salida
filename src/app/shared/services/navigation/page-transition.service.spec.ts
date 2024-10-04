import { TestBed } from '@angular/core/testing';

import { PageTransitionService } from './page-transition.service';

describe('PageTransitionService', () => {
  let service: PageTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTransitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
