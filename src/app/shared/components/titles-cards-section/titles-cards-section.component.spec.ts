import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlesCardsSectionComponent } from './titles-cards-section.component';

describe('TitlesCardsSectionComponent', () => {
  let component: TitlesCardsSectionComponent;
  let fixture: ComponentFixture<TitlesCardsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitlesCardsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitlesCardsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
