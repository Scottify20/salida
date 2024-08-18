import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOrBottomSheetComponent } from './popup-or-bottom-sheet.component';

describe('PopupOrBottomSheetComponent', () => {
  let component: PopupOrBottomSheetComponent;
  let fixture: ComponentFixture<PopupOrBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupOrBottomSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupOrBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
