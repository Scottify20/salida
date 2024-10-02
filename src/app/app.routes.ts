import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { movieDetailsRoutes } from './details/movie-details/feature/movie-details.routes';
import { seriesDetailsRoutes } from './details/series-details/feature/series-details.routes';
import { personDetailsRoutes } from './details/person-details/feature/person-details.routes';
import { HomeComponent } from './home/feature/home.component';

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
            (m) => m.LoginPageComponent,
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/feature/sign-up-page.component').then(
            (m) => m.SignUpPageComponent,
          ),
      },
      {
        path: 'set-username',
        loadComponent: () =>
          import(
            './auth/signup/ui/username-setting-page/username-setting-page.component'
          ).then((m) => m.UsernameSettingPageComponent),
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
    children: [
      {
        path: ':username',
        loadComponent: () =>
          import('./user/ui/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
      },
      { path: '', redirectTo: ':username', pathMatch: 'full' },
    ],
  },
  {
    path: 'lists',
    loadComponent: () =>
      import('./lists/feature/lists-home.component').then(
        (m) => m.ListsHomeComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search/feature/search-home.component').then(
        (m) => m.SearchHomeComponent,
      ),
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
