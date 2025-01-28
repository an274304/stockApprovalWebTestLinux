import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetServiceWaitingOrderAtAdminComponent } from './get-service-waiting-order-at-admin.component';

describe('GetServiceWaitingOrderAtAdminComponent', () => {
  let component: GetServiceWaitingOrderAtAdminComponent;
  let fixture: ComponentFixture<GetServiceWaitingOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetServiceWaitingOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetServiceWaitingOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
