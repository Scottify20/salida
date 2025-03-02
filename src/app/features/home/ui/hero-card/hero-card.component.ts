import { Component, Input, OnInit } from '@angular/core';
import { PlatformCheckService } from '../../../../shared/services/dom/platform-check.service';
import { MediaSummary } from '../../../../shared/interfaces/models/tmdb/All';
import { MovieDetailsService } from '../../../details/movie-details/data-access/movie-details.service';
import { SeriesDetailsService } from '../../../details/series-details/data-access/series-details.service';

export interface HeroCardProps extends MediaSummary {
  media_type: 'movie' | 'tv';
}

@Component({
  selector: 'app-hero-card',
  imports: [],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent implements OnInit {
  constructor(
    private movieDetailsService: MovieDetailsService,
    private seriesDetailsService: SeriesDetailsService,
    private platformCheck: PlatformCheckService,
  ) {}
  @Input() cardIndex = 0;
  @Input({ required: true }) props: MediaSummary = {
    media_type: 'movie',
    backdrop_path: null,
    id: 0,
    overview: '',
    poster_path: null,
    adult: false,
    original_language: '',
    genre_ids: [],
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
  };

  protected cardOpacity = 'opacity: 0%';

  onCardClick() {
    if (this.props.title) {
      this.movieDetailsService.viewMovieDetails(
        this.props.id,
        this.props.title as string,
      );
    } else if (this.props.name) {
      this.seriesDetailsService.viewSeriesDetails(
        this.props.id,
        this.props.name as string,
      );
    }
  }

  ngOnInit() {
    this.setOpacityOfCardDetailsOnLoad();
  }

  setOpacityOfCardDetailsOnLoad() {
    if (this.platformCheck.isServer()) return;
    setTimeout(() => (this.cardOpacity = 'opacity: 100%'), 0);
  }

  runCallbackOnClick(callback?: () => void) {
    if (callback) callback();
  }

  getImageSrcBasedOnWidth(): string {
    if (this.platformCheck.isServer()) return '';

    const baseLink = this.props.poster_path
      ? 'https://image.tmdb.org/t/p/'
      : '';
    const poster_path = this.props.poster_path;
    const windowWidth = window.innerWidth;

    if (windowWidth === 0) return '';
    if (windowWidth <= 320) return baseLink + 'w300' + poster_path;
    if (windowWidth <= 480) return baseLink + 'w500' + poster_path;
    if (windowWidth <= 720) return baseLink + 'w780' + this.props.backdrop_path;
    return baseLink + 'w1280' + this.props.backdrop_path;
  }

  get getPosterOrBackdropAlt() {
    if (window.innerWidth >= 481) {
      return this.props.media_type === 'movie'
        ? `${this.props.title} movie backdrop`
        : `${this.props.name} TV Series backdrop`;
    }

    return this.props.media_type === 'movie'
      ? `${this.props.title} movie poster`
      : `${this.props.name} TV Series poster`;
  }
}
