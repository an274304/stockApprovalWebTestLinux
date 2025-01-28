import { TestBed } from '@angular/core/testing';

import { ServiceTableMngService } from './service-table-mng.service';

describe('ServiceTableMngService', () => {
  let service: ServiceTableMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTableMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
