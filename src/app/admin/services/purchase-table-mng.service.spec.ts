import { TestBed } from '@angular/core/testing';

import { PurchaseTableMngService } from './purchase-table-mng.service';

describe('PurchaseTableMngService', () => {
  let service: PurchaseTableMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseTableMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
