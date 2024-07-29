import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillTabsComponent } from './pill-tabs.component';

describe('PillTabsComponent', () => {
  let component: PillTabsComponent;
  let fixture: ComponentFixture<PillTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PillTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
