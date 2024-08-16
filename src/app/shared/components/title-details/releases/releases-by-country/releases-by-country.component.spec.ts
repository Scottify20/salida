import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesByCountryComponent } from './releases-by-country.component';

describe('ReleasesByCountryComponent', () => {
  let component: ReleasesByCountryComponent;
  let fixture: ComponentFixture<ReleasesByCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasesByCountryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleasesByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
