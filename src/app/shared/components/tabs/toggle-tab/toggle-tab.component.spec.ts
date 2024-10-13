import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleTabComponent } from './toggle-tab.component';

describe('ToggleTabComponent', () => {
  let component: ToggleTabComponent;
  let fixture: ComponentFixture<ToggleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
