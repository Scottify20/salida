import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingPeopleComponent } from './trending-people.component';

describe('TrendingPeopleComponent', () => {
  let component: TrendingPeopleComponent;
  let fixture: ComponentFixture<TrendingPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingPeopleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrendingPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
