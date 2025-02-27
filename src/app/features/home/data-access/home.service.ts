import {
  Injectable,
  signal,
  WritableSignal,
  computed,
  effect,
} from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeMovieService } from './home-movie.service';
import { HomeSeriesService } from './home-series.service';
import { MediaCardsSectionProps } from '../../../shared/components/card-section/media-cards-section/media-cards-section.component';
import { MediaSummary } from '../../../shared/interfaces/models/tmdb/All';
import { CardsSectionScrollService } from '../../../shared/services/for-components/cards-section-scroll.service';
import { ListViewService } from '../../lists/data-access/list-view.service'; // Import ListViewService
import {
  ListInfo,
  ListSourceType,
} from '../../lists/feature/lists-home.component'; // Import ListInfo

type MediaTypeLabel = 'All' | 'Movies' | 'TV Shows';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  contentTypes: MediaTypeLabel[] = ['All', 'Movies', 'TV Shows'];

  selectedContentTypeName: WritableSignal<MediaTypeLabel> = signal('All');

  constructor(
    private homeMovieService: HomeMovieService,
    private homeSeriesService: HomeSeriesService,
    private cardsScrollService: CardsSectionScrollService,
    private listViewService: ListViewService, // Inject ListViewService
  ) {
    effect(() => {
      this.selectedContentTypeIndex();
      this.cardsScrollService.resetAllScrollPositions();
    });
  }

  setContentTypeByName(newName: MediaTypeLabel) {
    this.selectedContentTypeName.set(newName);
  }

  setContentTypeByIndex(index: number) {
    this.selectedContentTypeName.set(this.contentTypes[index]);
  }

  selectedContentTypeIndex = computed(() => {
    return this.contentTypes.indexOf(this.selectedContentTypeName());
  });

  getMoviesAndSeriesFromProviders$(): Observable<MediaCardsSectionProps[]> {
    return forkJoin({
      movies: this.homeMovieService.getMoviesFromProviders(),
      series: this.homeSeriesService.getSeriesFromProviders(),
    }).pipe(
      map(({ movies, series }) => {
        const combined: MediaCardsSectionProps[] = [];
        const providerMap = new Map<string, MediaCardsSectionProps>();

        // Map movies by provider
        movies.forEach((movieSection) => {
          providerMap.set(movieSection.sectionTitle.toString(), movieSection);
        });

        // Combine series with movies if they share the same provider
        series.forEach((seriesSection) => {
          const sectionTitle = seriesSection.sectionTitle.toString();
          if (providerMap.has(sectionTitle)) {
            const movieSection = providerMap.get(sectionTitle)!;

            // Extract provider ID from movieSection or seriesSection
            const providerId = movieSection.iconURL
              ? movieSection.titles[0]['watch_provider_id']
              : seriesSection.iconURL
                ? seriesSection.titles[0]['watch_provider_id']
                : null;

            const listInfo: ListInfo = {
              sourceType: 'provider',
              sourceName: sectionTitle,
              sourceID: providerId !== undefined ? providerId : null, // Use the extracted providerId
              listName: 'all',
              listID: 0,
            };

            const combinedSection: MediaCardsSectionProps = {
              iconURL: movieSection.iconURL, // Set the iconURL here
              id: sectionTitle + '-combined',
              sectionTitle: sectionTitle,
              maxNoOfTitles: 20,
              titles: [],
              saveScrollPosition: true,
              viewAllButtonProps: {
                onClick: () => {
                  this.listViewService.viewList(listInfo);
                },
              },
            };

            const movieEntities = movieSection.titles;
            const seriesEntities = seriesSection.titles;

            const maxLength = Math.max(
              movieEntities.length,
              seriesEntities.length,
            );
            for (let i = 0; i < maxLength; i++) {
              if (i < movieEntities.length) {
                combinedSection.titles.push(movieEntities[i]);
              }
              if (i < seriesEntities.length) {
                combinedSection.titles.push(seriesEntities[i]);
              }
            }

            if (combinedSection.titles.length >= 8) {
              combined.push(combinedSection);
            }
            providerMap.delete(sectionTitle);
          } else if (seriesSection.titles.length >= 8) {
            combined.push(seriesSection); // These already have iconURL set
          }
        });

        // Add remaining movie sections with at least 8 entities
        providerMap.forEach((movieSection) => {
          if (movieSection.titles.length >= 8) {
            combined.push(movieSection); // These already have iconURL set
          }
        });

        return combined;
      }),
    );
  }

  getPopularMoviesAndSeries$(): Observable<MediaSummary[]> {
    return forkJoin({
      movies: this.homeMovieService.getPopularMovies$(),
      series: this.homeSeriesService.getPopularSeries$(),
    }).pipe(
      map(({ movies, series }) => {
        const combined: MediaSummary[] = [];

        let movieIndex = 0;
        let seriesIndex = 0;

        while (
          combined.length < 5 &&
          (movieIndex < movies.length || seriesIndex < series.length)
        ) {
          if (movieIndex < movies.length) {
            combined.push(movies[movieIndex]);
            movieIndex++;
          }
          if (seriesIndex < series.length && combined.length < 5) {
            combined.push(series[seriesIndex]);
            seriesIndex++;
          }
        }
        return combined;
      }),
    );
  }
}
