import { TestBed } from '@angular/core/testing';

import { ServiceBillAccountService } from './service-bill-account.service';

describe('ServiceBillAccountService', () => {
  let service: ServiceBillAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBillAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
