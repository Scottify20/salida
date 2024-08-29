import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaHeroSectionComponent } from './media-hero-section.component';

describe('MediaHeroSectionComponent', () => {
  let component: MediaHeroSectionComponent;
  let fixture: ComponentFixture<MediaHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaHeroSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
