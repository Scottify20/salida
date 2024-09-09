import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { movieDetailsRoutes } from './details/movie-details/feature/movie-details.routes';
import { seriesDetailsRoutes } from './details/series-details/feature/series-details.routes';
import { personDetailsRoutes } from './details/person-details/feature/person-details.routes';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/feature/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/feature/sign-up-page.component').then(
            (m) => m.SignUpPageComponent
          ),
      },
    ],
  },
  {
    path: 'movie/:id',
    children: movieDetailsRoutes,
  },
  {
    path: 'series/:id',
    children: seriesDetailsRoutes,
  },
  { path: 'people/:id', children: personDetailsRoutes },
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

// REFERENCE STRUCTURE

// src/
//   app/
//     shared/
//       components/
//         tab-group/
//           tab-group.component.ts
//           tab-group.component.html
//           tab-group.component.css
//         secondary-tabs/
//           secondary-tabs.component.ts
//           secondary-tabs.component.html
//           secondary-tabs.component.css
//       services/
//         secondary-tab.service.ts
//       ...
//     core/
//       store/
//         ...
//     detail-pages/
//       movie-details/
//         feature/
//           movie-details.component.ts
//         data-access/
//           movie.service.ts
//         ui/
//           movie-details/
//             movie-details.component.html
//             movie-details.component.css
//             overview/
//               overview.component.ts
//               overview.component.html
//               overview.component.css
//             cast/
//               cast.component.ts
//               cast.component.html
//               cast.component.css
//             reviews/
//               reviews.component.ts
//               reviews.component.html
//               reviews.component.css
//       series-details/
//         // Similar structure to movie-details
//       shared/
//         ui/
//           shared.module.ts
//           components/
//             star-rating/
//               star-rating.component.ts
//               star-rating.component.html
//               star-rating.component.css
//   ...
