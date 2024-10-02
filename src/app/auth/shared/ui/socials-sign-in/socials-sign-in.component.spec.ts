import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialsSignInComponent } from './socials-sign-in.component';

describe('SocialsSignInComponent', () => {
  let component: SocialsSignInComponent;
  let fixture: ComponentFixture<SocialsSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialsSignInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialsSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
