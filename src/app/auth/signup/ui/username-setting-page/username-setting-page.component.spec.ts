import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameSettingPageComponent } from './username-setting-page.component';

describe('UsernameSettingPageComponent', () => {
  let component: UsernameSettingPageComponent;
  let fixture: ComponentFixture<UsernameSettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameSettingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameSettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
