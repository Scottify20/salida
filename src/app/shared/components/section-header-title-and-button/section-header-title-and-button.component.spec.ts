import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeaderTitleAndButtonComponent } from './section-header-title-and-button.component';

describe('SectionHeaderTitleAndButtonComponent', () => {
  let component: SectionHeaderTitleAndButtonComponent;
  let fixture: ComponentFixture<SectionHeaderTitleAndButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderTitleAndButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionHeaderTitleAndButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
