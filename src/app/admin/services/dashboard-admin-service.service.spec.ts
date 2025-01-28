import { TestBed } from '@angular/core/testing';

import { DashboardAdminServiceService } from './dashboard-admin-service.service';

describe('DashboardAdminServiceService', () => {
  let service: DashboardAdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
