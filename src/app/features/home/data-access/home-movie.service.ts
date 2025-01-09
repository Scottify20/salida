import { Injectable } from '@angular/core';
import { MovieService } from '../../../shared/services/tmdb/movie.service';
import {
  MovieSummary,
  MovieSummaryResults,
} from '../../../shared/interfaces/models/tmdb/Movies';
import { MovieDetailsService } from '../../details/movie-details/data-access/movie-details.service';
import { map, Observable, forkJoin, switchMap, filter } from 'rxjs';
import { TmdbConfigService } from '../../../shared/services/tmdb/tmdb-config.service';
import { MediaCardsSectionProps } from '../../../shared/components/card-section/media-cards-section/media-cards-section.component';

@Injectable({
  providedIn: 'root',
})
export class HomeMovieService {
  constructor(
    private movieService: MovieService,
    private movieDetailsService: MovieDetailsService,
    private tmdbConfigService: TmdbConfigService,
  ) {}

  getPopularMovies$(): Observable<MovieSummary[]> {
    return this.movieService
      .getPopularMovies$()
      .pipe(
        map((movies) =>
          movies.results
            .filter((movie) =>
              ['en', 'es', 'ko', 'ja', 'tl', 'hi'].includes(
                movie.original_language,
              ),
            )
            .map((movie) => ({ ...movie, media_type: 'movie' })),
        ),
      );
  }

  getMoviesInTheatres(): Observable<MediaCardsSectionProps> {
    return this.movieService.getMoviesPlayingInTheares$().pipe(
      map((movies) =>
        this.transformMoviesToCardSectionProps('In Theatres', movies),
      ),
      filter((section) => section.titles.length >= 8),
    );
  }

  getUpcomingMovies(): Observable<MediaCardsSectionProps> {
    return this.movieService.getUpcomingMovies$().pipe(
      map((movies) =>
        this.transformMoviesToCardSectionProps('Upcoming', movies),
      ),
      filter((section) => section.titles.length >= 8),
      map((movie) => ({ ...movie, media_type: 'movie' })),
    );
  }

  // Method for getting movies from providers
  getMoviesFromProviders(): Observable<MediaCardsSectionProps[]> {
    return this.tmdbConfigService.getWatchProviders().pipe(
      switchMap((providers) => {
        // providers.movie.forEach((provider) => {
        //   console.log(
        //     `Movie Provider: ${provider.provider_name}, ID: ${provider.provider_id}`,
        //   );
        // });
        return forkJoin(
          providers.movie.map((provider) =>
            this.movieService
              .getMoviesFromWatchProvider$(provider.provider_id)
              .pipe(
                map((movies) =>
                  this.transformMoviesToCardSectionProps(
                    provider.provider_name,
                    movies,
                  ),
                ),
              ),
          ),
        );
      }),
      map((sections) => {
        const filteredSections = sections.filter(
          (section) => section.titles.length >= 8,
        );
        return filteredSections;
      }),
    );
  }

  private transformMoviesToCardSectionProps(
    title: string,
    moviesResponse: MovieSummaryResults,
  ): MediaCardsSectionProps {
    return {
      viewAllButtonProps: { onClick: () => {} },
      sectionTitle: title,
      maxNoOfTitles: 20,
      titles: moviesResponse.results.map((movie) => ({
        ...movie,
        media_type: 'movie',
        onClick: () => {
          this.movieDetailsService.viewMovieDetails(movie.id, movie.title);
        },
      })),
    };
  }
}
