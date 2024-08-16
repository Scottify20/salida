import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextsSectionComponent } from './texts-section.component';

describe('TextsSectionComponent', () => {
  let component: TextsSectionComponent;
  let fixture: ComponentFixture<TextsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
