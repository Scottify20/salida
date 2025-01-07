import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillTabsOrDropdownMenuComponent } from './pill-tabs-or-dropdown-menu.component';

describe('PillTabsOrDropdownMenuComponent', () => {
  let component: PillTabsOrDropdownMenuComponent;
  let fixture: ComponentFixture<PillTabsOrDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillTabsOrDropdownMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillTabsOrDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
