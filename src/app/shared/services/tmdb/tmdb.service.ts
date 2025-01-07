import { Injectable } from '@angular/core';
import { SeriesService } from './series.service';
import { MovieService } from './movie.service';
import { PeopleService } from './people.service';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  constructor(
    public series: SeriesService,
    public movies: MovieService,
    public people: PeopleService,
  ) {}
}
