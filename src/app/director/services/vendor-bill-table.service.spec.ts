import { TestBed } from '@angular/core/testing';

import { VendorBillTableService } from './vendor-bill-table.service';

describe('VendorBillTableService', () => {
  let service: VendorBillTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorBillTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
