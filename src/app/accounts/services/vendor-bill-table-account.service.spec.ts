import { TestBed } from '@angular/core/testing';

import { VendorBillTableAccountService } from './vendor-bill-table-account.service';

describe('VendorBillTableAccountService', () => {
  let service: VendorBillTableAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorBillTableAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
