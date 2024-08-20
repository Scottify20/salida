import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TitleDetailsComponent } from './shared/components/title-details/title-details.component';
import { AdvisoriesComponent } from './shared/components/title-details/advisories/advisories.component';
import { ReviewsComponent } from './shared/components/title-details/reviews/reviews.component';
import { MoreDetailsComponent } from './shared/components/title-details/more-details/more-details.component';
import { SeasonsComponent } from './shared/components/title-details/seasons/seasons.component';
import { ReleasesComponent } from './shared/components/title-details/releases/releases.component';
import { PopupOrBottomSheetComponent } from './shared/components/popup-or-bottom-sheet/popup-or-bottom-sheet.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'series/:id',
    component: TitleDetailsComponent,
    children: [
      { path: 'details', component: MoreDetailsComponent },
      { path: 'reviews', component: ReviewsComponent },
      {
        path: 'seasons',
        component: SeasonsComponent,
        children: [{ path: 'picker', component: PopupOrBottomSheetComponent }],
      },
      { path: 'advisories', component: AdvisoriesComponent },
      { path: '', redirectTo: 'details', pathMatch: 'full' },
    ],
  },
  {
    path: 'movies/:id',
    component: TitleDetailsComponent,
    children: [
      { path: 'details', component: MoreDetailsComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'releases', component: ReleasesComponent },
      { path: '', redirectTo: 'details', pathMatch: 'full' }, // Default to details
    ],
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
