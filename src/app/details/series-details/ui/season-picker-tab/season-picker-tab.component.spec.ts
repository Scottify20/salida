import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonPickerTabComponent } from './season-picker-tab.component';

describe('SeasonPickerTabComponent', () => {
  let component: SeasonPickerTabComponent;
  let fixture: ComponentFixture<SeasonPickerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonPickerTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonPickerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
