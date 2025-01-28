import { TestBed } from '@angular/core/testing';

import { ServiceTableDirectorMngService } from './service-table-director-mng.service';

describe('ServiceTableDirectorMngService', () => {
  let service: ServiceTableDirectorMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTableDirectorMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
