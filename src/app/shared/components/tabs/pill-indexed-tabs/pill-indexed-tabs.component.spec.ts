import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillIndexedTabsComponent } from './pill-indexed-tabs.component';

describe('PillIndexedTabsComponent', () => {
  let component: PillIndexedTabsComponent;
  let fixture: ComponentFixture<PillIndexedTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillIndexedTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillIndexedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
