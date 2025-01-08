import {
  Component,
  DestroyRef,
  isSignal,
  signal,
  WritableSignal,
  ChangeDetectorRef,
  effect,
} from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import {
  Series,
  SeriesCastCredit,
  SeriesCrewCredit,
} from '../../../../../shared/interfaces/models/tmdb/Series';
import { Router } from '@angular/router';
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

@Component({
    selector: 'app-cast-and-crew',
    imports: [PeopleCardsSectionComponent],
    templateUrl: './cast-and-crew.component.html',
    styleUrl: './cast-and-crew.component.scss'
})
export class CastAndCrewComponent {
  seriesCrewSection: CardsSectionProps;
  seriesCastSection: CardsSectionProps;
  movieCrewSection: CardsSectionProps;
  movieCastSection: CardsSectionProps;

  constructor(
    protected movieDetailsService: MovieDetailsService,
    protected seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
    private router: Router,
    private preferencesService: TemporaryUserPreferencesService,
    private cdr: ChangeDetectorRef,
  ) {
    this.initializeMovieOrSeriesData();

    effect(() => {
      this.castOrCrew();
      this.initializeMovieOrSeriesData();
    });

    this.seriesCrewSection = this.createSectionProps(
      'Crew',
      'grid',
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.crew.map(this.getCrewMemberEntity)
        : [],
    );
    this.seriesCastSection = this.createSectionProps(
      'Cast',
      'grid',
      this.seriesDetailsService.isSeriesRoute && this.seriesData
        ? this.seriesData.aggregate_credits.cast.map(this.getCastMemberEntity)
        : [],
    );
    this.movieCrewSection = this.createSectionProps(
      'Crew',
      'grid',
      this.movieData
        ? this.movieData.credits.crew.map(this.getMovieCrewMemberEntity)
        : [],
    );
    this.movieCastSection = this.createSectionProps(
      'Cast',
      'grid',
      this.movieData
        ? this.movieData.credits.cast.map(this.getMovieCastMemberEntity)
        : [],
    );
  }

  castOrCrew =
    this.preferencesService.preferences.details.movieAndSeriesDetails
      .castOrCrew;

  seriesData: Series | undefined;
  movieData: Movie | undefined;

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
      sectionTitle,
      layout,
      maxNoOfCards: 1000,
      entities: signal([]),
    };

    const initialEntities = entities.slice(0, 30);
    (props.entities as WritableSignal<TmdbEntityForCard[]>).set(
      initialEntities,
    );

    setTimeout(() => {
      (props.entities as WritableSignal<TmdbEntityForCard[]>).set(entities);
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 500);

    return props;
  }

  private getCrewMemberEntity(crewMember: SeriesCrewCredit): TmdbEntityForCard {
    return {
      id: crewMember.id + crewMember.department,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: (crewMember as SeriesCrewCredit).jobs
        .map((job) => job.job)
        .join(' / '),
      callback: () => {
        this.router.navigate(['/people/', crewMember.id, 'details']);
      },
    };
  }

  private getCastMemberEntity(castMember: SeriesCastCredit): TmdbEntityForCard {
    return {
      id: castMember.id + castMember.roles.join('-'),
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: (castMember as SeriesCastCredit).roles[0]?.character ?? '',
      callback: () => {
        this.router.navigate(['/people/', castMember.id, 'details']);
      },
    };
  }

  private getMovieCrewMemberEntity(crewMember: MovieCredit): TmdbEntityForCard {
    return {
      id: crewMember.id + crewMember.job,
      name: crewMember.name,
      image_path: crewMember.profile_path ?? null,
      otherName: crewMember.job,
      callback: () => {
        this.router.navigate(['/people/', crewMember.id, 'details']);
      },
    };
  }

  private getMovieCastMemberEntity(
    castMember: MovieCastCredit,
  ): TmdbEntityForCard {
    return {
      id: castMember.id + castMember.character,
      name: castMember.name,
      image_path: castMember.profile_path ?? null,
      otherName: castMember.character ?? '',
      callback: () => {
        this.router.navigate(['/people/', castMember.id, 'details']);
      },
    };
  }
}
