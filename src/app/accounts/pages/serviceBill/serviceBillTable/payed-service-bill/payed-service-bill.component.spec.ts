import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayedServiceBillComponent } from './payed-service-bill.component';

describe('PayedServiceBillComponent', () => {
  let component: PayedServiceBillComponent;
  let fixture: ComponentFixture<PayedServiceBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayedServiceBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayedServiceBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
