import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVendorBillComponent } from './pending-vendor-bill.component';

describe('PendingVendorBillComponent', () => {
  let component: PendingVendorBillComponent;
  let fixture: ComponentFixture<PendingVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingVendorBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
