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
    return this.movieService.getPopularMovies$().pipe(
      map((movies) =>
        movies.results
          // .filter((movie) =>
          //   ['en', 'es', 'ko', 'ja', 'tl', 'hi'].includes(
          //     movie.original_language,
          //   ),
          // )
          .map((movie) => ({ ...movie, media_type: 'movie' })),
      ),
    );
  }

  getMoviesInTheatres(): Observable<MediaCardsSectionProps> {
    return this.movieService.getMoviesPlayingInTheares$().pipe(
      map((movies) =>
        this.transformMoviesToCardSectionProps(-1, 'In Theatres', movies),
      ),
      filter((section) => section.titles.length >= 6),
    );
  }

  getUpcomingMovies(): Observable<MediaCardsSectionProps> {
    return this.movieService.getUpcomingMovies$().pipe(
      map((movies) =>
        this.transformMoviesToCardSectionProps(-1, 'Upcoming', movies),
      ),
      filter((section) => section.titles.length >= 6),
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
                    provider.provider_id,
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
          (section) => section.titles.length >= 6,
        );
        return filteredSections;
      }),
    );
  }

  private transformMoviesToCardSectionProps(
    providerId: number,
    title: string,
    moviesResponse: MovieSummaryResults,
  ): MediaCardsSectionProps {
    const providerIcon = this.tmdbConfigService.getProviderIconURL(
      providerId,
      'series',
    );
    return {
      iconURL: providerIcon,
      id: title + '-movies',
      sectionTitle: title,
      maxNoOfTitles: 20,
      saveScrollPosition: true,
      viewAllButtonProps: { onClick: () => {} },
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
