import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonResultCardComponent } from './person-result-card.component';

describe('PersonResultCardComponent', () => {
  let component: PersonResultCardComponent;
  let fixture: ComponentFixture<PersonResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonResultCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
