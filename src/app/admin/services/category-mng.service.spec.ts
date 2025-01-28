import { TestBed } from '@angular/core/testing';

import { CategoryMngService } from './category-mng.service';

describe('CategoryMngService', () => {
  let service: CategoryMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
