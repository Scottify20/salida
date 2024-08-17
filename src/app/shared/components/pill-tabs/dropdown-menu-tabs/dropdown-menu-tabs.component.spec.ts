import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuTabsComponent } from './dropdown-menu-tabs.component';

describe('DropdownMenuTabsComponent', () => {
  let component: DropdownMenuTabsComponent;
  let fixture: ComponentFixture<DropdownMenuTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownMenuTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
