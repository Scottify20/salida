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
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SeriesDetailsService } from '../../../series-details/data-access/series-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, BehaviorSubject } from 'rxjs';

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
import { IntersectionObserverService } from '../../../../../shared/services/dom/intersection-observer.service';

@Component({
  selector: 'app-cast-and-crew',
  imports: [PeopleCardsSectionComponent],
  templateUrl: './cast-and-crew.component.html',
  styleUrl: './cast-and-crew.component.scss',
})
export class CastAndCrewComponent implements AfterViewInit {
  seriesCrewSection!: CardsSectionProps;
  seriesCastSection!: CardsSectionProps;
  movieCrewSection!: CardsSectionProps;
  movieCastSection!: CardsSectionProps;

  private seriesCrewEntities = new BehaviorSubject<TmdbEntityForCard[]>([]);
  private seriesCastEntities = new BehaviorSubject<TmdbEntityForCard[]>([]);
  private movieCrewEntities = new BehaviorSubject<TmdbEntityForCard[]>([]);
  private movieCastEntities = new BehaviorSubject<TmdbEntityForCard[]>([]);

  // Full lists for infinite scrolling
  private fullSeriesCrew: TmdbEntityForCard[] = [];
  private fullSeriesCast: TmdbEntityForCard[] = [];
  private fullMovieCrew: TmdbEntityForCard[] = [];
  private fullMovieCast: TmdbEntityForCard[] = [];

  @ViewChild('bottomIntersectionElement') bottomIntersectionRef!: ElementRef;

  constructor(
    protected movieDetailsService: MovieDetailsService,
    protected seriesDetailsService: SeriesDetailsService,
    private destroyRef: DestroyRef,
    private router: Router,
    private preferencesService: TemporaryUserPreferencesService,
    private intersectionObserver: IntersectionObserverService,
  ) {
    this.initializeSectionProps(); // Call here to initialize with empty arrays initially
    this.initializeMovieOrSeriesData();

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

  ngAfterViewInit() {
    this.startObserver();
  }

  private startObserver() {
    const element = this.bottomIntersectionRef.nativeElement as HTMLDivElement;
    const options = { rootMargin: '2000px' };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        const currentSection =
          this.castOrCrew() === 'cast'
            ? this.seriesCastSection
            : this.seriesCrewSection;
        const currentEntities = currentSection.entities.value;
        const currentLength = currentEntities.length;

        const fullList = // Get the correct full list based on castOrCrew and movie/series
          this.castOrCrew() === 'cast'
            ? this.seriesDetailsService.isSeriesRoute
              ? this.fullSeriesCast
              : this.fullMovieCast
            : this.seriesDetailsService.isSeriesRoute
              ? this.fullSeriesCrew
              : this.fullMovieCrew;

        const nextEntities = this.getNextEntities(fullList, currentLength);

        currentSection.entities.next([...currentEntities, ...nextEntities]);
      }
    };

    this.intersectionObserver.observe(element, observerCallback, options);
  }

  private getNextEntities(
    fullList: TmdbEntityForCard[],
    currentLength: number,
  ): TmdbEntityForCard[] {
    return fullList.slice(currentLength, currentLength + 30); // Slice from the full list
  }

  castOrCrew =
    this.preferencesService.preferences.details.movieAndSeriesDetails
      .castOrCrew;

  seriesData: Series | undefined;
  movieData: Movie | undefined;

  // ... (rest of the component code will follow in the next response)

  initializeSectionProps() {
    if (this.seriesDetailsService.isSeriesRoute && this.seriesData) {
      this.fullSeriesCrew = this.seriesData.aggregate_credits.crew.map((e) =>
        this.getCrewMemberEntity(e, this.router),
      );
      this.fullSeriesCast = this.seriesData.aggregate_credits.cast.map((e) =>
        this.getCastMemberEntity(e, this.router),
      );

      // Initialize BehaviorSubject with the first 30
      this.seriesCrewEntities.next(this.fullSeriesCrew.slice(0, 30));
      this.seriesCastEntities.next(this.fullSeriesCast.slice(0, 30));
    }

    if (this.movieData) {
      this.fullMovieCrew = this.movieData.credits.crew.map((e) =>
        this.getMovieCrewMemberEntity(e, this.router),
      );
      this.fullMovieCast = this.movieData.credits.cast.map((e) =>
        this.getMovieCastMemberEntity(e, this.router),
      );

      this.movieCrewEntities.next(this.fullMovieCrew.slice(0, 30));
      this.movieCastEntities.next(this.fullMovieCast.slice(0, 30));
    }

    this.seriesCrewSection = this.createSectionProps(
      '',
      'grid',
      this.seriesCrewEntities,
    );
    this.seriesCastSection = this.createSectionProps(
      '',
      'grid',
      this.seriesCastEntities,
    );
    this.movieCrewSection = this.createSectionProps(
      '',
      'grid',
      this.movieCrewEntities,
    );
    this.movieCastSection = this.createSectionProps(
      '',
      'grid',
      this.movieCastEntities,
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
              this.initializeSectionProps();
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
              this.initializeSectionProps();
            }
          }),
        )
        .subscribe();
    }
  }

  private createSectionProps(
    sectionTitle: string,
    layout: 'grid' | 'carousel',
    entities: BehaviorSubject<TmdbEntityForCard[]>,
  ): CardsSectionProps {
    const props: CardsSectionProps = {
      sectionTitle: sectionTitle,
      layout,
      maxNoOfCards: 1000,
      entities: entities,
    };

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

  get castCount(): string {
    const isMovie = this.movieDetailsService.isMovieRoute;
    const movieCastLength = this.movieData?.credits.cast.length;
    const isSeries = this.seriesDetailsService.isSeriesRoute;
    const seriesCastLength = this.seriesData?.aggregate_credits.cast.length;

    if (isMovie && movieCastLength) {
      return `Cast (${movieCastLength})`;
    } else if (isSeries && seriesCastLength) {
      return `Cast (${seriesCastLength})`;
    } else {
      return 'Cast';
    }
  }

  get crewCount(): string {
    const isMovie = this.movieDetailsService.isMovieRoute;
    const movieCrewLength = this.movieData?.credits.crew.length;
    const isSeries = this.seriesDetailsService.isSeriesRoute;
    const seriesCrewLength = this.seriesData?.aggregate_credits.crew.length;

    if (isMovie && movieCrewLength) {
      return `Crew (${movieCrewLength})`;
    } else if (isSeries && seriesCrewLength) {
      return `Crew (${seriesCrewLength})`;
    } else {
      return 'Crew';
    }
  }
}
