import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueScreen } from './league-screen';

describe('LeagueScreen', () => {
  let component: LeagueScreen;
  let fixture: ComponentFixture<LeagueScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
