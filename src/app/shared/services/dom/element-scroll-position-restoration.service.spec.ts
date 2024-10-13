import { TestBed } from '@angular/core/testing';

import { ElementScrollPositionRestorationService } from './element-scroll-position-restoration.service';

describe('ElementScrollPositionRestorationService', () => {
  let service: ElementScrollPositionRestorationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementScrollPositionRestorationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
