import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsHeaderComponent } from './buttons-header.component';

describe('ButtonsHeaderComponent', () => {
  let component: ButtonsHeaderComponent;
  let fixture: ComponentFixture<ButtonsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
