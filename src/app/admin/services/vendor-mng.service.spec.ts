import { TestBed } from '@angular/core/testing';

import { VendorMngService } from './vendor-mng.service';

describe('VendorMngService', () => {
  let service: VendorMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
