import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetServiceApprovalPendingOrderAtAdminComponent } from './get-service-approval-pending-order-at-admin.component';

describe('GetServiceApprovalPendingOrderAtAdminComponent', () => {
  let component: GetServiceApprovalPendingOrderAtAdminComponent;
  let fixture: ComponentFixture<GetServiceApprovalPendingOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetServiceApprovalPendingOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetServiceApprovalPendingOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
