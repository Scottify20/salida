import { TestBed } from '@angular/core/testing';

import { WindowResizeDimensionService } from './window-resize.service';

describe('WindowResizeService', () => {
  let service: WindowResizeDimensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowResizeDimensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
