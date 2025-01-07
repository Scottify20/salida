import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverMenuComponent } from './popover-menu.component';

describe('PopoverMenuComponent', () => {
  let component: PopoverMenuComponent;
  let fixture: ComponentFixture<PopoverMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
