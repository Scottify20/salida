import { TestBed } from '@angular/core/testing';

import { HomeMovieService } from './home-movie.service';

describe('HomeMovieService', () => {
  let service: HomeMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
