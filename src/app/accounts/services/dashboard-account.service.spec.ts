import { TestBed } from '@angular/core/testing';

import { DashboardAccountService } from './dashboard-account.service';

describe('DashboardAccountService', () => {
  let service: DashboardAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
