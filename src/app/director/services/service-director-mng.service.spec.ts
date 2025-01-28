import { TestBed } from '@angular/core/testing';

import { ServiceDirectorMngService } from './service-director-mng.service';

describe('ServiceDirectorMngService', () => {
  let service: ServiceDirectorMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDirectorMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
