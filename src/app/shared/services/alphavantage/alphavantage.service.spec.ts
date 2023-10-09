import {TestBed} from '@angular/core/testing';

import {AlphavantageService} from './alphavantage.service';

describe('AlphavantageService', () => {
  let service: AlphavantageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphavantageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
