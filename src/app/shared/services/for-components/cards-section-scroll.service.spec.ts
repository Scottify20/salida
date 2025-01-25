import { TestBed } from '@angular/core/testing';

import { CardsSectionScrollService } from './cards-section-scroll.service';

describe('CardsSectionScrollService', () => {
  let service: CardsSectionScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsSectionScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
