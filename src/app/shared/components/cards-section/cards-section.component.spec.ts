import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsSectionComponent } from './cards-section.component';

describe('TitlesCardsSectionComponent', () => {
  let component: CardsSectionComponent;
  let fixture: ComponentFixture<CardsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
