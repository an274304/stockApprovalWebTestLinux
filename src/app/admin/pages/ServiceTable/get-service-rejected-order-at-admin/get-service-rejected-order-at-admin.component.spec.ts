import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetServiceRejectedOrderAtAdminComponent } from './get-service-rejected-order-at-admin.component';

describe('GetServiceRejectedOrderAtAdminComponent', () => {
  let component: GetServiceRejectedOrderAtAdminComponent;
  let fixture: ComponentFixture<GetServiceRejectedOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetServiceRejectedOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetServiceRejectedOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
