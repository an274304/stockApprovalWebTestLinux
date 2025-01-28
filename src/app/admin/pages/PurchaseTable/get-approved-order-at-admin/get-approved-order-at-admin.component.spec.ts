import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetApprovedOrderAtAdminComponent } from './get-approved-order-at-admin.component';

describe('GetApprovedOrderAtAdminComponent', () => {
  let component: GetApprovedOrderAtAdminComponent;
  let fixture: ComponentFixture<GetApprovedOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetApprovedOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetApprovedOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
