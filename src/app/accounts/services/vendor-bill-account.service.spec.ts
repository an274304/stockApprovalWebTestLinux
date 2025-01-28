import { TestBed } from '@angular/core/testing';

import { VendorBillAccountService } from './vendor-bill-account.service';

describe('VendorBillAccountService', () => {
  let service: VendorBillAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorBillAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
