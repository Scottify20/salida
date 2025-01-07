import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastAndCrewComponent } from './cast-and-crew.component';

describe('CastAndCrewComponent', () => {
  let component: CastAndCrewComponent;
  let fixture: ComponentFixture<CastAndCrewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastAndCrewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastAndCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
