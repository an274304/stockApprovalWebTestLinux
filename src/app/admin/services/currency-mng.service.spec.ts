import { TestBed } from '@angular/core/testing';

import { CurrencyMngService } from './currency-mng.service';

describe('CurrencyMngService', () => {
  let service: CurrencyMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
