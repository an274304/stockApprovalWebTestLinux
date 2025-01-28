import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindVendorBillComponent } from './find-vendor-bill.component';

describe('FindVendorBillComponent', () => {
  let component: FindVendorBillComponent;
  let fixture: ComponentFixture<FindVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindVendorBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
