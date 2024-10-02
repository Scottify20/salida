import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerWithTitleComponent } from './divider-with-title.component';

describe('DividerWithTitleComponent', () => {
  let component: DividerWithTitleComponent;
  let fixture: ComponentFixture<DividerWithTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerWithTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividerWithTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
