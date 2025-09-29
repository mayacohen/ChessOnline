import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTracker } from './game-tracker';

describe('GameTracker', () => {
  let component: GameTracker;
  let fixture: ComponentFixture<GameTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
