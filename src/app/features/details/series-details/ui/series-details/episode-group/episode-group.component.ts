import { Component, ElementRef, inject, Input } from '@angular/core';
import { Season } from '../../../../../../shared/interfaces/models/tmdb/Series';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';

@Component({
  selector: 'app-episode-group',
  imports: [EpisodeCardComponent],
  templateUrl: './episode-group.component.html',
  styleUrl: './episode-group.component.scss',
})
export class EpisodeGroupComponent {
  @Input() seasonData: Season = {
    _id: '',
    air_date: '',
    episodes: [],
    name: '',
    overview: '',
    id: 0,
    poster_path: '',
    season_number: 0,
    vote_average: 0,
    external_ids: {
      tvdb_id: 0,
    },
    images: {
      posters: [],
      backdrops: [],
      logos: [],
    },
  };

  // to prevent glitching of the [sticky-element] s during tab transition
  private elRef: ElementRef = inject(ElementRef);

  ngAfterViewChecked() {
    const el = this.elRef.nativeElement as HTMLElement;
    const stickyEls = Array.from(
      el.querySelectorAll('[sticky-element]'),
    ) as HTMLElement[];

    setTimeout(() => {
      stickyEls.forEach((el) => {
        el.classList.add('sticky');
      });
    }, 350);
  }
}
