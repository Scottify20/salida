import { Route } from '@angular/router';
import { SeriesDetailsComponent } from './series-details.component';
import { SeriesMoreDetailsComponent } from '../ui/series-more-details/series-more-details.component';
import { SeasonsComponent } from '../ui/seasons/seasons.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';

export const seriesDetailsRoutes: Route[] = [
  {
    path: '',
    component: SeriesDetailsComponent,
    children: [
      {
        path: 'details',
        component: SeriesMoreDetailsComponent,
      },
      {
        path: 'seasons',
        component: SeasonsComponent,
        // loadComponent: () =>
        //   import('../ui/seasons/seasons.component').then(
        //     (m) => m.SeasonsComponent
        //   ),
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
        // loadComponent: () =>
        //   import('../../shared/ui/reviews/reviews.component').then(
        //     (m) => m.ReviewsComponent
        //   ),
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' },
    ],
  },
];
