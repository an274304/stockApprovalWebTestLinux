import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetServiceApprovedOrderAtAdminComponent } from './get-service-approved-order-at-admin.component';

describe('GetServiceApprovedOrderAtAdminComponent', () => {
  let component: GetServiceApprovedOrderAtAdminComponent;
  let fixture: ComponentFixture<GetServiceApprovedOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetServiceApprovedOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetServiceApprovedOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
