import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesMoreDetailsComponent } from './series-more-details.component';

describe('SeriesMoreDetailsComponent', () => {
  let component: SeriesMoreDetailsComponent;
  let fixture: ComponentFixture<SeriesMoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesMoreDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
