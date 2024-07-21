import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsHeaderComponent } from '../shared/components/buttons-header/buttons-header.component';
import { HeroCardsComponent } from './hero-cards/hero-cards.component';
import { CardsSectionComponent } from '../shared/components/cards-section/cards-section.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ButtonsHeaderComponent,
    HeroCardsComponent,
    CardsSectionComponent,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
