import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesByReleaseTypeComponent } from './releases-by-release-type.component';

describe('ReleasesByReleaseTypeComponent', () => {
  let component: ReleasesByReleaseTypeComponent;
  let fixture: ComponentFixture<ReleasesByReleaseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasesByReleaseTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleasesByReleaseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
