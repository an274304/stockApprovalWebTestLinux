import { TestBed } from '@angular/core/testing';

import { PurchaseMngService } from './purchase-mng.service';

describe('PurchaseMngService', () => {
  let service: PurchaseMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
