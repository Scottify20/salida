import { Component, DestroyRef } from '@angular/core';
import { MediaHeroSectionComponent } from '../../shared/ui/media-hero-section/media-hero-section.component';
import {
  UserPreferences,
  TemporaryUserPreferencesService,
} from '../../../shared/services/preferences/temporary-user-preferences-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PillIndexedTabsComponent,
  PillIndexedTabsProps,
} from '../../../shared/components/tabs/pill-indexed-tabs/pill-indexed-tabs.component';
import { MovieMoreDetailsComponent } from '../ui/movie-details/movie-more-details/movie-more-details.component';
import { ReleasesComponent } from '../ui/movie-details/releases/releases.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    MediaHeroSectionComponent,
    PillIndexedTabsComponent,
    MovieMoreDetailsComponent,
    ReleasesComponent,
    ReviewsComponent,
  ],
  templateUrl: '../ui/movie-details/movie-details.component.html',
  styleUrl: '../ui/movie-details/movie-details.component.scss',
})
export class MovieDetailsComponent {
  constructor(
    private preferencesService: TemporaryUserPreferencesService,
    private destroyRef: DestroyRef,
  ) {
    this.preferencesService.preferences$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((preferences) => {
          if (!preferences) {
            return;
          }
          this.userPreferences = preferences;
        }),
      )
      .subscribe();
  }

  private userPreferences!: UserPreferences;

  previousTabIndex: number | null = null;
  currentTabIndex: number = 0;

  setTabIndex(index: number) {
    this.previousTabIndex = Number(this.currentTabIndex);
    this.currentTabIndex = index;
  }

  pillIndexedTabsProps: PillIndexedTabsProps = {
    buttonContent: 'text',
    tabs: [
      {
        text: 'Details',
      },
      {
        text: 'Releases',
      },
      {
        text: 'Reviews',
      },
    ],
  };
}
