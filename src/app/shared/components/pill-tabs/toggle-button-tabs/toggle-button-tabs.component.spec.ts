import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleButtonTabsComponent } from './toggle-button-tabs.component';

describe('ToggleButtonTabsComponent', () => {
  let component: ToggleButtonTabsComponent;
  let fixture: ComponentFixture<ToggleButtonTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleButtonTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleButtonTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
