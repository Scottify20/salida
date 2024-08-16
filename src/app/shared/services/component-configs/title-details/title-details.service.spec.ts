import { TestBed } from '@angular/core/testing';

import { TitleDetailsService } from './title-details.service';

describe('TitleDetailsService', () => {
  let service: TitleDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
