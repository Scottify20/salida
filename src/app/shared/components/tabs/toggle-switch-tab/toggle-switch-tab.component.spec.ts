import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchTabComponent } from './toggle-switch-tab.component';

describe('ToggleSwitchTabComponent', () => {
  let component: ToggleSwitchTabComponent;
  let fixture: ComponentFixture<ToggleSwitchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleSwitchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
