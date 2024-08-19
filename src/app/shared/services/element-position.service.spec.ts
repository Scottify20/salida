import { TestBed } from '@angular/core/testing';

import { ElementPositionService } from './element-position.service';

describe('ElementPositionService', () => {
  let service: ElementPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
