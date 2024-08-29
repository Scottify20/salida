import { TestBed } from '@angular/core/testing';

import { PersonDetailsService } from './person-details.service';

describe('PersonDetailsService', () => {
  let service: PersonDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
