import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchTabsComponent } from './toggle-switch-tabs.component';

describe('ToggleSwitchTabsComponent', () => {
  let component: ToggleSwitchTabsComponent;
  let fixture: ComponentFixture<ToggleSwitchTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleSwitchTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
