import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCardsSectionComponent } from './people-cards-section.component';

describe('PeopleCardsSectionComponent', () => {
  let component: PeopleCardsSectionComponent;
  let fixture: ComponentFixture<PeopleCardsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleCardsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleCardsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
