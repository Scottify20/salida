import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsMenuPopoverComponent } from './user-actions-menu-popover.component';

describe('UserActionsMenuPopoverComponent', () => {
  let component: UserActionsMenuPopoverComponent;
  let fixture: ComponentFixture<UserActionsMenuPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActionsMenuPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionsMenuPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
