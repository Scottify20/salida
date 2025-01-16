import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCardSkeletonComponent } from './result-card-skeleton.component';

describe('ResultCardSkeletonComponent', () => {
  let component: ResultCardSkeletonComponent;
  let fixture: ComponentFixture<ResultCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
