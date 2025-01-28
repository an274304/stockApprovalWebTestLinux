import { TestBed } from '@angular/core/testing';

import { ProductMngService } from './product-mng.service';

describe('ProductMngService', () => {
  let service: ProductMngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
