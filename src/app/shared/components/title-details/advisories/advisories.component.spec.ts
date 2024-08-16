import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesComponent } from './advisories.component';

describe('AdvisoriesComponent', () => {
  let component: AdvisoriesComponent;
  let fixture: ComponentFixture<AdvisoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvisoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
