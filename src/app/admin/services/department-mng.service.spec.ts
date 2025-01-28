import { TestBed } from '@angular/core/testing';

import { DepartmentMngService } from './department-mng.service';

describe('DepartmentMngService', () => {
  let service: DepartmentMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
