import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestConfirmation } from './request-confirmation';

describe('RequestConfirmation', () => {
  let component: RequestConfirmation;
  let fixture: ComponentFixture<RequestConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
