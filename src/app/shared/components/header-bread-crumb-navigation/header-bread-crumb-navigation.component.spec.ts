import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBreadCrumbNavigationComponent } from './header-bread-crumb-navigation.component';

describe('HeaderBreadCrumbNavigationComponent', () => {
  let component: HeaderBreadCrumbNavigationComponent;
  let fixture: ComponentFixture<HeaderBreadCrumbNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBreadCrumbNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderBreadCrumbNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
