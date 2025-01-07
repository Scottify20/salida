import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCardsSectionComponent } from './media-cards-section.component';

describe('MediaCardsSectionComponent', () => {
  let component: MediaCardsSectionComponent;
  let fixture: ComponentFixture<MediaCardsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCardsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCardsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
