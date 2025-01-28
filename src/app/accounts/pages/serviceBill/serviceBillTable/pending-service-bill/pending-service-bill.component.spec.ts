import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingServiceBillComponent } from './pending-service-bill.component';

describe('PendingServiceBillComponent', () => {
  let component: PendingServiceBillComponent;
  let fixture: ComponentFixture<PendingServiceBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingServiceBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingServiceBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
