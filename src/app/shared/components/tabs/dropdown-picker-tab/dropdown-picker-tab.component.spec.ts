import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPickerTabComponent } from './dropdown-picker-tab.component';

describe('DropdownPickerTabComponent', () => {
  let component: DropdownPickerTabComponent;
  let fixture: ComponentFixture<DropdownPickerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownPickerTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownPickerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
