import { TestBed } from '@angular/core/testing';

import { ScrollDetectorService } from './scroll-detector.service';

describe('ScrollDetectorService', () => {
  let service: ScrollDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
