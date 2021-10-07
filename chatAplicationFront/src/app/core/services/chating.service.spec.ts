import { TestBed } from '@angular/core/testing';

import { ChatingService } from './chating.service';

describe('ChatingService', () => {
  let service: ChatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
