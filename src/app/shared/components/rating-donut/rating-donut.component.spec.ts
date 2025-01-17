import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingDonutComponent } from './rating-donut.component';

describe('RatingDonutComponent', () => {
  let component: RatingDonutComponent;
  let fixture: ComponentFixture<RatingDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingDonutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
