import { Injectable, inject } from '@angular/core';
import { SeriesService } from './series.service';
import { MovieService } from './movie.service';
import { PeopleService } from './people.service';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {  series = inject(SeriesService);
  movies = inject(MovieService);
  people = inject(PeopleService);

}
