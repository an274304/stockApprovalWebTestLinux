import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayedVendorBillComponent } from './payed-vendor-bill.component';

describe('PayedVendorBillComponent', () => {
  let component: PayedVendorBillComponent;
  let fixture: ComponentFixture<PayedVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayedVendorBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayedVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
