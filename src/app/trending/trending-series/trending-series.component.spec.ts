import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingSeriesComponent } from './trending-series.component';

describe('TrendingSeriesComponent', () => {
  let component: TrendingSeriesComponent;
  let fixture: ComponentFixture<TrendingSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingSeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrendingSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
