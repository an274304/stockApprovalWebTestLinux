import { TestBed } from '@angular/core/testing';

import { ServiceMngService } from './service-mng.service';

describe('ServiceMngService', () => {
  let service: ServiceMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
