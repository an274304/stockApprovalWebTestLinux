import { TestBed } from '@angular/core/testing';

import { StockMngService } from './stock-mng.service';

describe('StockMngService', () => {
  let service: StockMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
