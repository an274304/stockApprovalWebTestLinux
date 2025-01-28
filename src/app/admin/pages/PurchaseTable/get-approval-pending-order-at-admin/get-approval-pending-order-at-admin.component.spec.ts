import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetApprovalPendingOrderAtAdminComponent } from './get-approval-pending-order-at-admin.component';

describe('GetApprovalPendingOrderAtAdminComponent', () => {
  let component: GetApprovalPendingOrderAtAdminComponent;
  let fixture: ComponentFixture<GetApprovalPendingOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetApprovalPendingOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetApprovalPendingOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
