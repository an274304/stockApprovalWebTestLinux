import { TestBed } from '@angular/core/testing';

import { VendorBillService } from './vendor-bill.service';

describe('VendorBillService', () => {
  let service: VendorBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
