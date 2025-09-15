import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSignup } from './google-signup';

describe('GoogleSignup', () => {
  let component: GoogleSignup;
  let fixture: ComponentFixture<GoogleSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
