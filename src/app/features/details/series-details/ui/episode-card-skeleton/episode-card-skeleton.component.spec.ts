import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeCardSkeletonComponent } from './episode-card-skeleton.component';

describe('EpisodeCardSkeletonComponent', () => {
  let component: EpisodeCardSkeletonComponent;
  let fixture: ComponentFixture<EpisodeCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
