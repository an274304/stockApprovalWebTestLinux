import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCompletedOrderAtAdminComponent } from './get-completed-order-at-admin.component';

describe('GetCompletedOrderAtAdminComponent', () => {
  let component: GetCompletedOrderAtAdminComponent;
  let fixture: ComponentFixture<GetCompletedOrderAtAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetCompletedOrderAtAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetCompletedOrderAtAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
