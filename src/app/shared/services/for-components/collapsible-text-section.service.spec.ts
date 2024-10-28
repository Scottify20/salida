import { TestBed } from '@angular/core/testing';

import { CollapsibleTextSectionService } from './collapsible-text-section.service';

describe('CollapsibleTextSectionService', () => {
  let service: CollapsibleTextSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollapsibleTextSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
