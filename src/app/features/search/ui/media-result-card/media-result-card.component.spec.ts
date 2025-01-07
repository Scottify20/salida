import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaResultCardComponent } from './media-result-card.component';

describe('MediaResultCardComponent', () => {
  let component: MediaResultCardComponent;
  let fixture: ComponentFixture<MediaResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaResultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
