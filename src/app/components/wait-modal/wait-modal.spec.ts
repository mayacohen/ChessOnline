import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitModal } from './wait-modal';

describe('WaitModal', () => {
  let component: WaitModal;
  let fixture: ComponentFixture<WaitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
