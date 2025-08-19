import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsForGame } from './player-details-for-game';

describe('PlayerDetailsForGame', () => {
  let component: PlayerDetailsForGame;
  let fixture: ComponentFixture<PlayerDetailsForGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDetailsForGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDetailsForGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
