import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'series',
    loadChildren: () =>
      import('./series/series.module').then((m) => m.SeriesModule),
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movies/movies.module').then((m) => m.MoviesModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
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
    loadChildren: () =>
      import('./trending/trending.module').then((m) => m.TrendingModule),
  },
  { path: '**', component: NotFoundComponent },
];
