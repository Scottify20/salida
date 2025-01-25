import {
  Component,
  DestroyRef,
  isSignal,
  signal,
  WritableSignal,
  ChangeDetectorRef,
  effect,
  ElementRef,
  inject,
} from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import {
  Series,
  SeriesCastCredit,
  SeriesCrewCredit,
} from '../../../../../shared/interfaces/models/tmdb/Series';

import {
  Movie,
  MovieCastCredit,
  MovieCredit,
} from '../../../../../shared/interfaces/models/tmdb/Movies';
import { MovieDetailsService } from '../../../movie-details/data-access/movie-details.service';
import {
  CardsSectionProps,
  PeopleCardsSectionComponent,
} from '../../../../../shared/components/card-section/people-cards-section/people-cards-section.component';
import { TemporaryUserPreferencesService } from '../../../../../shared/services/preferences/temporary-user-preferences-service';
import { TmdbEntityForCard } from '../../../../../shared/components/card-section/person-card/person-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cast-and-crew',
  imports: [PeopleCardsSectionComponent],
  templateUrl: './cast-and-crew.component.html',
  styleUrl: './cast-and-crew.component.scss',
})
export class CastAndCrewComponent {
  seriesCrewSection!: CardsSectionProps;
  seriesCastSection!: CardsSectionProps;
  movieCrewSection!: CardsSectionProps;
  movieCastSection!: CardsSectionProps;

  constructor(
    protected movieDetailsService: MovieDetailsService,
    protected seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
    private router: Router,
    private preferencesService: TemporaryUserPreferencesService,
  ) {
    this.initializeMovieOrSeriesData();
    this.initializeSectionProps();

    effect(() => {
      this.castOrCrew();
      this.initializeMovieOrSeriesData();
    });
  }

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

  castOrCrew =
    this.preferencesService.preferences.details.movieAndSeriesDetails
      .castOrCrew;

  seriesData: Series | undefined;
  movieData: Movie | undefined;

  initializeSectionProps() {
    this.seriesCrewSection = this.createSectionProps(
      '',
      'grid',
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.crew.map((e) =>
            this.getCrewMemberEntity(e, this.router),
          )
        : [],
    );
    this.seriesCastSection = this.createSectionProps(
      '',
      'grid',
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.cast.map((e) =>
            this.getCastMemberEntity(e, this.router),
          )
        : [],
    );
    this.movieCrewSection = this.createSectionProps(
      '',
      'grid',
      this.movieData
        ? this.movieData.credits.crew.map((e) =>
            this.getMovieCrewMemberEntity(e, this.router),
          )
        : [],
    );
    this.movieCastSection = this.createSectionProps(
      '',
      'grid',
      this.movieData
        ? this.movieData.credits.cast.map((e) =>
            this.getMovieCastMemberEntity(e, this.router),
          )
        : [],
    );
  }

  extractEntities(
    entities: TmdbEntityForCard[] | WritableSignal<TmdbEntityForCard[]>,
  ): TmdbEntityForCard[] {
    if (isSignal(entities)) {
      return entities();
    } else {
      return entities;
    }
  }

  private initializeMovieOrSeriesData() {
    if (this.movieDetailsService.isMovieRoute) {
      this.movieDetailsService.movieData$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((movie) => {
            if (movie) {
              this.movieData = movie;
            }
          }),
        )
        .subscribe();
    }
    if (this.seriesDetailsService.isSeriesRoute) {
      this.seriesDetailsService.seriesData$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((series) => {
            if (series) {
              this.seriesData = series;
            }
          }),
        )
        .subscribe();
    }
  }

  private createSectionProps(
    sectionTitle: string,
    layout: 'grid' | 'carousel',
    entities: TmdbEntityForCard[],
  ): CardsSectionProps {
    const props: CardsSectionProps = {
      sectionTitle: sectionTitle,
      layout,
      maxNoOfCards: 1000,
      entities: [],
    };

    const initialEntities = entities.slice(0, 30);
    props.entities = initialEntities;

    setTimeout(() => {
      props.entities.push(...entities.slice(30, 100));
    }, 500);

    setTimeout(() => {
      props.entities.push(...entities.slice(100));
    }, 1000);

    return props;
  }

  private getCrewMemberEntity(
    crewMember: SeriesCrewCredit,
    router: Router,
  ): TmdbEntityForCard {
    return {
      id: crewMember.id + crewMember.department,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: (crewMember as SeriesCrewCredit).jobs
        .map((job) => job.job)
        .join(' / '),
      callback: () => {
        router.navigateByUrl(`/people/${crewMember.id}/details'`);
      },
    };
  }

  private getCastMemberEntity(
    castMember: SeriesCastCredit,
    router: Router,
  ): TmdbEntityForCard {
    return {
      id: castMember.id + castMember.roles.join('-'),
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: (castMember as SeriesCastCredit).roles[0]?.character ?? '',
      callback: () => {
        router.navigateByUrl(`/people/${castMember.id}/details'`);
      },
    };
  }

  private getMovieCrewMemberEntity(
    crewMember: MovieCredit,
    router: Router,
  ): TmdbEntityForCard {
    return {
      id: crewMember.id + crewMember.job,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: crewMember.job,
      callback: () => {
        router.navigateByUrl(`/people/${crewMember.id}/details'`);
      },
    };
  }

  private getMovieCastMemberEntity(
    castMember: MovieCastCredit,
    router: Router,
  ): TmdbEntityForCard {
    return {
      id: castMember.id + castMember.character,
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: castMember.character ?? '',
      callback: () => {
        router.navigateByUrl(`/people/${castMember.id}/details'`);
      },
    };
  }
}
