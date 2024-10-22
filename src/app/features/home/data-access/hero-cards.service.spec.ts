import { TestBed } from '@angular/core/testing';

import { HeroCardsService } from './hero-cards.service';

describe('HeroCardsService', () => {
  let service: HeroCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
