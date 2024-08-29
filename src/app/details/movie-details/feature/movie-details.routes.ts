import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './movie-details.component';
import { MovieMoreDetailsComponent } from '../ui/movie-more-details/movie-more-details.component';
import { ReleasesComponent } from '../ui/releases/releases.component';
import { ReviewsComponent } from '../../shared/ui/reviews/reviews.component';

export const movieDetailsRoutes: Routes = [
  {
    path: '',
    component: MovieDetailsComponent,
    children: [
      { path: 'details', component: MovieMoreDetailsComponent },
      {
        path: 'releases',
        component: ReleasesComponent,
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' },
    ],
  },
];
