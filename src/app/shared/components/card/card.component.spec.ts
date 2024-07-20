import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPosterAndTitleComponent } from './card.component';

describe('CardPosterAndTitleComponent', () => {
  let component: CardPosterAndTitleComponent;
  let fixture: ComponentFixture<CardPosterAndTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPosterAndTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPosterAndTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
