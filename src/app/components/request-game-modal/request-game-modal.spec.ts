import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGameModal } from './request-game-modal';

describe('RequestGameModal', () => {
  let component: RequestGameModal;
  let fixture: ComponentFixture<RequestGameModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestGameModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestGameModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
