import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TmdbConfigService } from '../../../shared/services/tmdb/tmdb-config.service';
import { SeriesService } from '../../../shared/services/tmdb/series.service';
import { SeriesDetailsService } from '../../details/series-details/data-access/series-details.service';
import {
  SeriesSummary,
  SeriesSummaryResults,
} from '../../../shared/interfaces/models/tmdb/Series';
import { MediaCardsSectionProps } from '../../../shared/components/card-section/media-cards-section/media-cards-section.component';

@Injectable({
  providedIn: 'root',
})
export class HomeSeriesService {
  constructor(
    private seriesService: SeriesService,
    private seriesDetailsService: SeriesDetailsService,
    private tmdbConfigService: TmdbConfigService,
  ) {}

  getPopularSeries$(): Observable<SeriesSummary[]> {
    return this.seriesService.getPopularSeries$().pipe(
      map((series) =>
        series.results
          // .filter((series) =>
          //   series.origin_country.some((country) =>
          //     [
          //       'US',
          //       'PH',
          //       'KR',
          //       'JP',
          //       'ES',
          //       'PH',
          //       'UK',
          //       'CA',
          //       'AU',
          //       'IN',
          //     ].includes(country),
          //   ),
          // )
          .map((series) => ({ ...series, media_type: 'tv' })),
      ),
    );
  }

  getSeriesFromProviders(): Observable<MediaCardsSectionProps[]> {
    return this.tmdbConfigService.getWatchProviders().pipe(
      switchMap((providers) => {
        // providers.series.forEach((provider) => {
        //   console.log(
        //     `Series Provider: ${provider.provider_name}, ID: ${provider.provider_id}`,
        //   );
        // });
        return forkJoin(
          providers.series.map((provider) =>
            this.seriesService
              .getSeriesFromWatchProvider$(provider.provider_id)
              .pipe(
                map((seriesSummaryResults: SeriesSummaryResults) =>
                  this.transformSeriesToCardSectionProps(
                    provider.provider_id,
                    provider.provider_name,
                    seriesSummaryResults,
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

  private transformSeriesToCardSectionProps(
    providerId: number,
    title: string,
    seriesResponse: SeriesSummaryResults,
  ): MediaCardsSectionProps {
    const providerIcon = this.tmdbConfigService.getProviderIconURL(
      providerId,
      'series',
    );

    return {
      iconURL: providerIcon,
      id: title + '-series',
      sectionTitle: title,
      maxNoOfTitles: 20,
      saveScrollPosition: true,
      viewAllButtonProps: { onClick: () => {} },
      titles: seriesResponse.results.map((series) => ({
        ...series,
        media_type: 'tv',
        onClick: () => {
          this.seriesDetailsService.viewSeriesDetails(series.id, series.name);
        },
      })),
    };
  }
}
