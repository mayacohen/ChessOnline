import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSignup } from './facebook-signup';

describe('FacebookSignup', () => {
  let component: FacebookSignup;
  let fixture: ComponentFixture<FacebookSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
