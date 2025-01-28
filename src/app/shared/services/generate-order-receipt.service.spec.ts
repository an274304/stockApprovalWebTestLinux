import { TestBed } from '@angular/core/testing';

import { GenerateOrderReceiptService } from './generate-order-receipt.service';

describe('GenerateOrderReceiptService', () => {
  let service: GenerateOrderReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateOrderReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
