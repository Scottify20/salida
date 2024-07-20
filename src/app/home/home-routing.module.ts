import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsHeaderComponent } from '../shared/components/buttons-header/buttons-header.component';
import { HeroCardsComponent } from './hero-cards/hero-cards.component';
import { TitlesCardsSectionComponent } from '../shared/components/titles-cards-section/titles-cards-section.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ButtonsHeaderComponent,
    HeroCardsComponent,
    TitlesCardsSectionComponent,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
