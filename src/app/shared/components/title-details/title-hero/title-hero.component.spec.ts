import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleHeroComponent } from './title-hero.component';

describe('TitleHeroComponent', () => {
  let component: TitleHeroComponent;
  let fixture: ComponentFixture<TitleHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleHeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
