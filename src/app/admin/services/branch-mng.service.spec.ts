import { TestBed } from '@angular/core/testing';

import { BranchMngService } from './branch-mng.service';

describe('BranchMngService', () => {
  let service: BranchMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
