import { TestBed } from '@angular/core/testing';

import { Gamelogic } from './gamelogic';

describe('Gamelogic', () => {
  let service: Gamelogic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gamelogic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
