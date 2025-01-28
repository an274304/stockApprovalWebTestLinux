import { TestBed } from '@angular/core/testing';

import { ServiceBillTableAccountService } from './service-bill-table-account.service';

describe('ServiceBillTableAccountService', () => {
  let service: ServiceBillTableAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBillTableAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
