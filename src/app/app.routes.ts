import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrendingMoviesComponent } from './trending/trending-movies/trending-movies.component';
import { TrendingSeriesComponent } from './trending/trending-series/trending-series.component';
import { TrendingPeopleComponent } from './trending/trending-people/trending-people.component';
import { NotFoundComponent } from './not-found/not-found.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./lists/lists.module').then((m) => m.ListsModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'trending',
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: 'movies', component: TrendingMoviesComponent },
      { path: 'series', component: TrendingSeriesComponent },
      { path: 'people', component: TrendingPeopleComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
