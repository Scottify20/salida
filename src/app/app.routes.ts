import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { personDetailsRoutes } from './details/person-details/feature/person-details.routes';
import { HomeComponent } from './home/feature/home.component';
import { loginAndSignupGuard } from './shared/guards/login-and-signup.guard';

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
        canActivate: [loginAndSignupGuard],
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/feature/sign-up-page.component').then(
            (m) => m.SignUpPageComponent,
          ),
        canActivate: [loginAndSignupGuard],
      },
      {
        path: 'set-username',
        loadComponent: () =>
          import(
            './auth/signup/ui/sign-up-page/username-setting-page/username-setting-page.component'
          ).then((m) => m.UsernameSettingPageComponent),
      },
    ],
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./details/movie-details/feature/movie-details.component').then(
        (m) => m.MovieDetailsComponent,
      ),
  },
  {
    path: 'series/:id',
    loadComponent: () =>
      import('./details/series-details/feature/series-details.component').then(
        (m) => m.SeriesDetailsComponent,
      ),
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
//             releases/
//               releases.component.ts
//               releases.component.html
//               releases.component.css
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
