import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignUpPageComponent } from './login-sign-up-page.component';

describe('LoginSignUpPageComponent', () => {
  let component: LoginSignUpPageComponent;
  let fixture: ComponentFixture<LoginSignUpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSignUpPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
