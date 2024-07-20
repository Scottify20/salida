import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { HeroCardsComponent } from './hero-cards/hero-cards.component';
import { ButtonsHeaderComponent } from '../shared/components/buttons-header/buttons-header.component';
import { TitlesCardsSectionComponent } from '../shared/components/titles-cards-section/titles-cards-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    ButtonsHeaderComponent,
    HeroCardsComponent,
    TitlesCardsSectionComponent,
  ],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  constructor() {}

  @ViewChild(HeroCardsComponent) heroCards!: HeroCardsComponent;

  ngAfterViewInit(): void {
    this.heroCards.startCardsScrollBasedAnimation();
  }
  ngOnDestroy(): void {
    this.heroCards.stopCardsScrollBasedAnimation();
  }
}
