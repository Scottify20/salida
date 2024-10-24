import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieMoreDetailsComponent } from './movie-more-details.component';

describe('MovieMoreDetailsComponent', () => {
  let component: MovieMoreDetailsComponent;
  let fixture: ComponentFixture<MovieMoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieMoreDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
