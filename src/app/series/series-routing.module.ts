import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleDetailsComponent } from '../shared/components/title-details/title-details.component';

const routes: Routes = [{ path: '**', component: TitleDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesRoutingModule {}
