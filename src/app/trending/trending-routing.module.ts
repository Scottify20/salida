import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrendingMoviesComponent } from './trending-movies/trending-movies.component';
import { TrendingPeopleComponent } from './trending-people/trending-people.component';
import { TrendingSeriesComponent } from './trending-series/trending-series.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'movies', component: TrendingMoviesComponent },
  { path: 'series', component: TrendingSeriesComponent },
  { path: 'people', component: TrendingPeopleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrendingRoutingModule {}
