import { TestBed } from '@angular/core/testing';

import { ScrollDisablerService } from './scroll-disabler.service';

describe('ScrollDisablerService', () => {
  let service: ScrollDisablerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollDisablerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
