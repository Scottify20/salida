import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotSectionComponent } from './plot-section.component';

describe('PlotSectionComponent', () => {
  let component: PlotSectionComponent;
  let fixture: ComponentFixture<PlotSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlotSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
