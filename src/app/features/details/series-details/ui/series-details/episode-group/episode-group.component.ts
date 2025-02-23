import { Component, ElementRef, inject, Input } from '@angular/core';
import { Season } from '../../../../../../shared/interfaces/models/tmdb/Series';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import {
  ChipComponent,
  ChipProps,
} from '../../../../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-episode-group',
  imports: [EpisodeCardComponent, ChipComponent],
  templateUrl: './episode-group.component.html',
  styleUrl: './episode-group.component.scss',
})
export class EpisodeGroupComponent {
  @Input() seasonData!: Season;

  // to prevent glitching of the [sticky-element] s during tab transition
  private elRef: ElementRef = inject(ElementRef);

  get episodeChipProps(): ChipProps {
    return {
      text: this.seasonData.episodes.length + ' Episodes',
      onClickFn: () => {
        console.log('534534534');
      },
    };
  }

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
