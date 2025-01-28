import { TestBed } from '@angular/core/testing';

import { DashboardDirectorServiceService } from './dashboard-director-service.service';

describe('DashboardDirectorServiceService', () => {
  let service: DashboardDirectorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardDirectorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
