import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleTextSectionComponent } from './collapsible-text-section.component';

describe('CollapsibleTextSectionComponent', () => {
  let component: CollapsibleTextSectionComponent;
  let fixture: ComponentFixture<CollapsibleTextSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleTextSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollapsibleTextSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
